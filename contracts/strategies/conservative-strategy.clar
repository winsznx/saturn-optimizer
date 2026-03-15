;; Saturn conservative strategy mock.
;;
;; Security boundary:
;; - Only `saturn-vault` may call the state-mutating entrypoints in this contract.
;; - This keeps the strategy as an implementation detail of the vault rather than a
;;   public asset-routing surface.
;;
;; Mock behavior:
;; - The conservative route only deploys STX into the StackingDAO adapter.
;; - Any `sBTC` amount passed into `deploy-idle` is intentionally left unused so the
;;   vault can keep that liquidity idle while the conservative STX leg remains active.
(impl-trait .strategy-trait.strategy-trait)

(define-constant ERR_UNAUTHORIZED u500)
(define-constant VAULT .saturn-vault)

(define-private (assert-vault-caller)
  (if (is-eq contract-caller VAULT)
    (ok true)
    (err ERR_UNAUTHORIZED)
  )
)

(define-public (deploy-idle (sbtc-amount uint) (stx-amount uint))
  (let (
      (stx-result
        (if (> stx-amount u0)
          (contract-call? .stackingdao-adapter deposit-stx stx-amount)
          (ok u0)
        )
      )
    )
    (begin
      (try! (assert-vault-caller))
      sbtc-amount
      (match stx-result used-stx
        (ok {sbtc-used: u0, stx-used: used-stx})
        err-code
        (err err-code)
      )
    )
  )
)

(define-public (free-assets (sbtc-needed uint) (stx-needed uint))
  (let (
      (stx-result
        (if (> stx-needed u0)
          ;; In the live integration the adapter should return recalled funds to the
          ;; vault custody boundary, and the vault will complete user payout after its
          ;; own liquidity checks.
          (contract-call? .stackingdao-adapter withdraw-stx stx-needed VAULT)
          (ok u0)
        )
      )
    )
    (begin
      (try! (assert-vault-caller))
      sbtc-needed
      (match stx-result freed-stx
        (ok {sbtc-freed: u0, stx-freed: freed-stx})
        err-code
        (err err-code)
      )
    )
  )
)

(define-public (harvest)
  (begin
    (try! (assert-vault-caller))
    (contract-call? .stackingdao-adapter harvest)
  )
)

(define-read-only (managed-balances)
  (contract-call? .stackingdao-adapter position)
)
