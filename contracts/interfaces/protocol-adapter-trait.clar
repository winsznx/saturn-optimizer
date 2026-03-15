(define-trait protocol-adapter-trait
  (
    (deposit-sbtc (uint) (response uint uint))
    (withdraw-sbtc (uint principal) (response uint uint))
    (deposit-stx (uint) (response uint uint))
    (withdraw-stx (uint principal) (response uint uint))
    (harvest () (response bool uint))
    (position () (response {sbtc: uint, stx: uint, ststx: uint} uint))
  )
)

