;; Saturn Zest adapter mock.
;;
;; Planned mainnet principals:
;; - Borrow entrypoint: SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.pool-borrow
;; - Reserve/accounting surface: SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.pool-0-reserve
;;
;; Published upstream calls:
;; - supply (lp <ft-mint-trait>) (pool-reserve principal) (asset <ft>) (amount uint) (owner principal))
;;   -> (response bool uint)
;; - withdraw (pool-reserve principal) (asset <ft>) (oracle <oracle-trait>)
;;   (assets (list 100 { asset: <ft>, lp-token: <ft>, oracle: <oracle-trait> }))
;;   (amount uint) (current-balance uint) (owner principal))
;;   -> (response uint uint)
;;
;; Asset flow:
;; The live adapter will accept vault-owned sBTC, call Zest's `supply` entrypoint
;; against the pinned reserve, and leave the vault holding the resulting reserve
;; receipt exposure. On exit it will call Zest `withdraw`, receive underlying sBTC
;; back to the vault principal, and report the amount released. The Saturn adapter
;; trait intentionally normalizes Zest's mixed bool/amount response surface into a
;; single amount-based accounting interface for the vault, so this mock returns the
;; sBTC amount accepted or released while `position` tracks the live-equivalent
;; exposure held through Zest.
;;
;; Security boundary:
;; - Only the Saturn balanced strategy may call the state-mutating entrypoints here.
;; - This mock models managed exposure with internal counters; vault custody remains
;;   with the vault contract in simnet until live protocol transfers are wired.
(impl-trait .protocol-adapter-trait.protocol-adapter-trait)

(define-constant ERR_UNSUPPORTED_ASSET u200)
(define-constant ERR_INVALID_AMOUNT u201)
(define-constant ERR_INSUFFICIENT_POSITION u202)
(define-constant ERR_UNAUTHORIZED u203)
(define-constant BALANCED-STRATEGY .balanced-strategy)

(define-data-var sbtc-position uint u0)
(define-data-var harvest-count uint u0)

(define-private (assert-strategy-caller)
  (if (is-eq contract-caller BALANCED-STRATEGY)
    (ok true)
    (err ERR_UNAUTHORIZED)
  )
)

(define-public (deposit-sbtc (amount uint))
  (begin
    (try! (assert-strategy-caller))
    (asserts! (> amount u0) (err ERR_INVALID_AMOUNT))
    (var-set sbtc-position (+ (var-get sbtc-position) amount))
    (ok amount)
  )
)

(define-public (withdraw-sbtc (amount uint) (recipient principal))
  (let ((current-position (var-get sbtc-position)))
    (begin
      (try! (assert-strategy-caller))
      recipient
      (asserts! (> amount u0) (err ERR_INVALID_AMOUNT))
      (asserts! (>= current-position amount) (err ERR_INSUFFICIENT_POSITION))
      (var-set sbtc-position (- current-position amount))
      (ok amount)
    )
  )
)

(define-public (deposit-stx (amount uint))
  (begin
    (try! (assert-strategy-caller))
    amount
    (err ERR_UNSUPPORTED_ASSET)
  )
)

(define-public (withdraw-stx (amount uint) (recipient principal))
  (begin
    (try! (assert-strategy-caller))
    amount
    recipient
    (err ERR_UNSUPPORTED_ASSET)
  )
)

(define-public (harvest)
  (begin
    (try! (assert-strategy-caller))
    (var-set harvest-count (+ (var-get harvest-count) u1))
    (ok true)
  )
)

(define-read-only (position)
  (ok {sbtc: (var-get sbtc-position), stx: u0, ststx: u0})
)

(define-read-only (get-harvest-count)
  (var-get harvest-count)
)
