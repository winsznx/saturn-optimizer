;; Saturn balanced strategy mock.
;;
;; Security boundary:
;; - Only `saturn-vault` may invoke state-mutating entrypoints.
;; - Only approved Saturn adapters receive calls from this strategy.
;;
;; Mock behavior:
;; - The strategy expresses allocation policy and adapter wiring, while the adapters
;;   track managed exposure with internal counters for simnet.
;; - In the live system recalled assets should return to the vault custody boundary
;;   before the vault completes any user withdrawal.
(impl-trait .strategy-trait.strategy-trait)

(define-constant SPLIT_NUMERATOR u60)
(define-constant SPLIT_DENOMINATOR u100)
(define-constant ERR_INSUFFICIENT_SBTC_LIQUIDITY u500)
(define-constant ERR_UNAUTHORIZED u501)
(define-constant ERR_POSITION_READ_FAILED u502)
(define-constant VAULT .saturn-vault)

(define-private (min-amount (left uint) (right uint))
  (if (<= left right) left right)
)

(define-private (assert-vault-caller)
  (if (is-eq contract-caller VAULT)
    (ok true)
    (err ERR_UNAUTHORIZED)
  )
)

(define-public (deploy-idle (sbtc-amount uint) (stx-amount uint))
  (let (
      (zest-sbtc (/ (* sbtc-amount SPLIT_NUMERATOR) SPLIT_DENOMINATOR))
      (bitflow-sbtc (- sbtc-amount (/ (* sbtc-amount SPLIT_NUMERATOR) SPLIT_DENOMINATOR)))
      (zest-result
        (if (> zest-sbtc u0)
          (contract-call? .zest-adapter deposit-sbtc zest-sbtc)
          (ok u0)
        )
      )
      (bitflow-sbtc-result
        (if (> bitflow-sbtc u0)
          (contract-call? .bitflow-adapter deposit-sbtc bitflow-sbtc)
          (ok u0)
        )
      )
      (bitflow-stx-result
        (if (> stx-amount u0)
          (contract-call? .bitflow-adapter deposit-stx stx-amount)
          (ok u0)
        )
      )
    )
    (begin
      (try! (assert-vault-caller))
      (match zest-result used-zest
        (match bitflow-sbtc-result used-bitflow-sbtc
          (match bitflow-stx-result used-bitflow-stx
            (ok {sbtc-used: (+ used-zest used-bitflow-sbtc), stx-used: used-bitflow-stx})
            err-code
            (err err-code)
          )
          err-code
          (err err-code)
        )
        err-code
        (err err-code)
      )
    )
  )
)

(define-public (free-assets (sbtc-needed uint) (stx-needed uint))
  (let (
      (zest-position (unwrap! (contract-call? .zest-adapter position) (err ERR_POSITION_READ_FAILED)))
      (bitflow-position (unwrap! (contract-call? .bitflow-adapter position) (err ERR_POSITION_READ_FAILED)))
      (zest-available (get sbtc zest-position))
      (bitflow-available (get sbtc bitflow-position))
    )
    (begin
      (try! (assert-vault-caller))
      (asserts! (<= sbtc-needed (+ zest-available bitflow-available)) (err ERR_INSUFFICIENT_SBTC_LIQUIDITY))
      (let (
          (zest-withdrawal (min-amount zest-available sbtc-needed))
          (bitflow-withdrawal (- sbtc-needed zest-withdrawal))
          (zest-result
            (if (> zest-withdrawal u0)
              (contract-call? .zest-adapter withdraw-sbtc zest-withdrawal VAULT)
              (ok u0)
            )
          )
          (bitflow-sbtc-result
            (if (> bitflow-withdrawal u0)
              (contract-call? .bitflow-adapter withdraw-sbtc bitflow-withdrawal VAULT)
              (ok u0)
            )
          )
          (bitflow-stx-result
            (if (> stx-needed u0)
              (contract-call? .bitflow-adapter withdraw-stx stx-needed VAULT)
              (ok u0)
            )
          )
        )
        (match zest-result freed-zest
          (match bitflow-sbtc-result freed-bitflow-sbtc
            (match bitflow-stx-result freed-stx
              (ok {sbtc-freed: (+ freed-zest freed-bitflow-sbtc), stx-freed: freed-stx})
              err-code
              (err err-code)
            )
            err-code
            (err err-code)
          )
          err-code
          (err err-code)
        )
      )
    )
  )
)

(define-public (harvest)
  (begin
    (try! (assert-vault-caller))
    (try! (contract-call? .zest-adapter harvest))
    (contract-call? .bitflow-adapter harvest)
  )
)

(define-read-only (managed-balances)
  (let (
      (zest-position (unwrap! (contract-call? .zest-adapter position) (err ERR_POSITION_READ_FAILED)))
      (bitflow-position (unwrap! (contract-call? .bitflow-adapter position) (err ERR_POSITION_READ_FAILED)))
    )
    (ok {
      sbtc: (+ (get sbtc zest-position) (get sbtc bitflow-position)),
      stx: (get stx bitflow-position),
      ststx: u0
    })
  )
)
