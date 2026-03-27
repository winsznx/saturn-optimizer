;; Saturn Token (SIP-010 compliant)
;; Deployer can mint freely. No vault dependency required.

(impl-trait .sip010-ft-trait.sip010-ft-trait)

(define-constant ERR_UNAUTHORIZED u100)
(define-constant ERR_INVALID_AMOUNT u102)
(define-constant ERR_INSUFFICIENT_BALANCE u103)

(define-data-var deployer principal tx-sender)
(define-data-var token-name (string-ascii 32) "Saturn Token")
(define-data-var token-symbol (string-ascii 10) "SATURN")
(define-data-var token-decimals uint u6)
(define-data-var token-uri (optional (string-utf8 256)) none)
(define-data-var total-supply uint u0)

(define-map balances principal uint)

(define-private (assert-deployer)
  (if (is-eq tx-sender (var-get deployer))
    (ok true)
    (err ERR_UNAUTHORIZED)
  )
)

(define-private (credit (recipient principal) (amount uint))
  (map-set balances recipient (+ (default-to u0 (map-get? balances recipient)) amount))
)

(define-public (mint (amount uint) (recipient principal))
  (begin
    (try! (assert-deployer))
    (asserts! (> amount u0) (err ERR_INVALID_AMOUNT))
    (credit recipient amount)
    (var-set total-supply (+ (var-get total-supply) amount))
    (ok amount)
  )
)

(define-public (burn (amount uint) (owner principal))
  (let ((current-balance (default-to u0 (map-get? balances owner))))
    (begin
      (try! (assert-deployer))
      (asserts! (> amount u0) (err ERR_INVALID_AMOUNT))
      (asserts! (>= current-balance amount) (err ERR_INSUFFICIENT_BALANCE))
      (map-set balances owner (- current-balance amount))
      (var-set total-supply (- (var-get total-supply) amount))
      (ok amount)
    )
  )
)

(define-public (transfer
    (amount uint)
    (sender principal)
    (recipient principal)
    (memo (optional (buff 34)))
  )
  (let ((current-balance (default-to u0 (map-get? balances sender))))
    (begin
      memo
      (asserts! (> amount u0) (err ERR_INVALID_AMOUNT))
      (asserts! (is-eq tx-sender sender) (err ERR_UNAUTHORIZED))
      (asserts! (>= current-balance amount) (err ERR_INSUFFICIENT_BALANCE))
      (map-set balances sender (- current-balance amount))
      (credit recipient amount)
      (ok true)
    )
  )
)

(define-read-only (get-name)
  (ok (var-get token-name))
)

(define-read-only (get-symbol)
  (ok (var-get token-symbol))
)

(define-read-only (get-decimals)
  (ok (var-get token-decimals))
)

(define-read-only (get-balance (owner principal))
  (ok (default-to u0 (map-get? balances owner)))
)

(define-read-only (get-total-supply)
  (ok (var-get total-supply))
)

(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)
