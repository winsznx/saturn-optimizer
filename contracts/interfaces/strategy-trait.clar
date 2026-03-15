(define-trait strategy-trait
  (
    (deploy-idle (uint uint) (response {sbtc-used: uint, stx-used: uint} uint))
    (free-assets (uint uint) (response {sbtc-freed: uint, stx-freed: uint} uint))
    (harvest () (response bool uint))
    (managed-balances () (response {sbtc: uint, stx: uint, ststx: uint} uint))
  )
)

