(impl-trait .protocol-adapter-trait.protocol-adapter-trait)

(define-constant ERR_INVALID_AMOUNT u201)
(define-constant ERR_INSUFFICIENT_POSITION u202)

(define-data-var sbtc-position uint u0)

(define-public (deposit-sbtc (amount uint))
  (begin
    (asserts! (> amount u0) (err ERR_INVALID_AMOUNT))
    (var-set sbtc-position (+ (var-get sbtc-position) amount))
    (ok amount)
  )
)

(define-public (withdraw-sbtc (amount uint) (recipient principal))
  (begin
    recipient
    (asserts! (> amount u0) (err ERR_INVALID_AMOUNT))
    (asserts! (>= (var-get sbtc-position) amount) (err ERR_INSUFFICIENT_POSITION))
    (var-set sbtc-position (- (var-get sbtc-position) amount))
    (ok amount)
  )
)

(define-public (deposit-stx (amount uint))
  (ok amount)
)

(define-public (withdraw-stx (amount uint) (recipient principal))
  (begin
    recipient
    (ok amount)
  )
)

(define-public (harvest)
  (ok true)
)

(define-read-only (position)
  (ok {sbtc: (var-get sbtc-position), stx: u0, ststx: u0})
)
