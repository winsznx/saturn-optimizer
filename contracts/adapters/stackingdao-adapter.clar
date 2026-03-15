;; Saturn StackingDAO adapter mock.
;;
;; Planned mainnet principals:
;; - Core vault entrypoint: SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.stacking-dao-core-v1
;; - Reserve contract: SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.reserve-v1
;; - Receipt token: SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.ststx-token
;;
;; Published upstream calls:
;; - deposit (reserve-contract <reserve-trait>) (stx-amount uint) (referrer (optional principal)))
;;   -> (response uint uint)
;; - init-withdraw (reserve-contract <reserve-trait>) (ststx-amount uint))
;;   -> (response uint uint)
;; - withdraw (reserve-contract <reserve-trait>) (nft-id uint))
;;   -> (response uint uint)
;; - get-stx-per-ststx (reserve-contract <reserve-trait>))
;;   -> (response uint uint)
;;
;; Asset flow:
;; The live adapter will move vault-owned STX into the StackingDAO core contract,
;; which forwards principal to the reserve contract and mints `stSTX` back to the
;; vault. Withdrawals are two-step in the upstream system: the adapter first opens a
;; withdrawal ticket with `init-withdraw`, then finalizes settlement with `withdraw`
;; once the cycle unlocks. Saturn's adapter trait collapses that richer flow into the
;; amount of STX currently represented by the strategy, so the mock stores a
;; `stSTX`-denominated position and returns the STX amount minted or redeemed at par.
;;
;; Security boundary:
;; - Only the Saturn conservative strategy may call the state-mutating entrypoints.
;; - The mock records `stSTX`-denominated exposure without pretending that the full
;;   asynchronous withdrawal lifecycle is already implemented on-chain here.
(impl-trait .protocol-adapter-trait.protocol-adapter-trait)

(define-constant ERR_UNSUPPORTED_ASSET u200)
(define-constant ERR_INVALID_AMOUNT u201)
(define-constant ERR_INSUFFICIENT_POSITION u202)
(define-constant ERR_UNAUTHORIZED u203)
(define-constant CONSERVATIVE-STRATEGY .conservative-strategy)

(define-data-var ststx-position uint u0)
(define-data-var harvest-count uint u0)

(define-private (assert-strategy-caller)
  (if (is-eq contract-caller CONSERVATIVE-STRATEGY)
    (ok true)
    (err ERR_UNAUTHORIZED)
  )
)

(define-public (deposit-sbtc (amount uint))
  (begin
    (try! (assert-strategy-caller))
    amount
    (err ERR_UNSUPPORTED_ASSET)
  )
)

(define-public (withdraw-sbtc (amount uint) (recipient principal))
  (begin
    (try! (assert-strategy-caller))
    amount
    recipient
    (err ERR_UNSUPPORTED_ASSET)
  )
)

(define-public (deposit-stx (amount uint))
  (begin
    (try! (assert-strategy-caller))
    (asserts! (> amount u0) (err ERR_INVALID_AMOUNT))
    (var-set ststx-position (+ (var-get ststx-position) amount))
    (ok amount)
  )
)

(define-public (withdraw-stx (amount uint) (recipient principal))
  (let ((current-position (var-get ststx-position)))
    (begin
      (try! (assert-strategy-caller))
      recipient
      (asserts! (> amount u0) (err ERR_INVALID_AMOUNT))
      (asserts! (>= current-position amount) (err ERR_INSUFFICIENT_POSITION))
      (var-set ststx-position (- current-position amount))
      (ok amount)
    )
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
  (ok {sbtc: u0, stx: u0, ststx: (var-get ststx-position)})
)

(define-read-only (get-harvest-count)
  (var-get harvest-count)
)
