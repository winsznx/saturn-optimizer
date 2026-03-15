;; Saturn BitFlow adapter mock.
;;
;; Planned mainnet principals:
;; - Stable pool: SPQC38PW542EQJ5M11CR25P7BS1CA6QT4TBXGB3M.stableswap-stx-ststx-v-1-2
;; - Rewards contract: SPQC38PW542EQJ5M11CR25P7BS1CA6QT4TBXGB3M.earn-stx-ststx-v-1-2
;;
;; Published upstream calls:
;; - add-liquidity (y-token <sip-010-trait>) (lp-token <lp-trait>)
;;   (x-amount-added uint) (y-amount-added uint) (min-lp-amount uint))
;;   -> (response uint (string-ascii 33))
;; - withdraw-liquidity (y-token <sip-010-trait>) (lp-token <lp-trait>)
;;   (lp-amount uint) (min-x-amount uint) (min-y-amount uint))
;;   -> (response {withdrawal-x-balance: uint, withdrawal-y-balance: uint} (string-ascii 47))
;; - stake-lp-tokens (y-token <sip-010-trait>) (lp-token <sip-010-trait>) (cycles uint) (amount uint))
;;   -> (response bool (string-ascii 30))
;; - claim-all-staking-rewards (y-token <sip-010-trait>) (lp-token <sip-010-trait>))
;;   -> (response {x-token-reward: uint} (string-ascii 27))
;; - unstake-all-lp-tokens (y-token <sip-010-trait>) (lp-token <sip-010-trait>))
;;   -> (response uint (string-ascii 32))
;;
;; Asset flow:
;; The live BitFlow path is STX-focused in this MVP. The adapter will pair vault STX
;; with vault-held `stSTX`, add liquidity into the stSTX/STX pool, stake the LP token
;; in the BitFlow rewards contract, and later unwind liquidity back into the vault.
;; The sBTC leg remains mocked until BitFlow exposes a pinned sBTC mainnet pool that
;; fits the Saturn risk model. The mock therefore returns the amount of STX or sBTC
;; the vault can safely account for after the adapter call, while `position` tracks
;; open exposure in the same shape the vault expects.
;;
;; Security boundary:
;; - Only the Saturn balanced strategy may call the state-mutating entrypoints.
;; - The mock tracks simulated exposure with internal counters so tests can prove the
;;   routing and auth model before live pool transfers are wired.
(impl-trait .protocol-adapter-trait.protocol-adapter-trait)

(define-constant ERR_INVALID_AMOUNT u201)
(define-constant ERR_INSUFFICIENT_POSITION u202)
(define-constant ERR_UNAUTHORIZED u203)
(define-constant BALANCED-STRATEGY .balanced-strategy)

(define-data-var sbtc-position uint u0)
(define-data-var stx-position uint u0)
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
    (asserts! (> amount u0) (err ERR_INVALID_AMOUNT))
    (var-set stx-position (+ (var-get stx-position) amount))
    (ok amount)
  )
)

(define-public (withdraw-stx (amount uint) (recipient principal))
  (let ((current-position (var-get stx-position)))
    (begin
      (try! (assert-strategy-caller))
      recipient
      (asserts! (> amount u0) (err ERR_INVALID_AMOUNT))
      (asserts! (>= current-position amount) (err ERR_INSUFFICIENT_POSITION))
      (var-set stx-position (- current-position amount))
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
  (ok {sbtc: (var-get sbtc-position), stx: (var-get stx-position), ststx: u0})
)

(define-read-only (get-harvest-count)
  (var-get harvest-count)
)
