(impl-trait .sip010-ft-trait.sip010-ft-trait)

(define-constant ERR_UNAUTHORIZED u100)
(define-constant ERR_ALREADY_INITIALIZED u101)
(define-constant ERR_INVALID_AMOUNT u102)
(define-constant ERR_INSUFFICIENT_BALANCE u103)
(define-constant ERR_INVALID_NAME u104)
(define-constant ERR_INVALID_SYMBOL u105)
(define-constant ERR_INVALID_DECIMALS u106)
(define-constant ERR_INVALID_OWNER u107)
(define-constant ERR_INVALID_RECIPIENT u108)
(define-constant ERR_INVALID_VAULT u109)

(define-data-var deployer principal tx-sender)
(define-data-var vault principal tx-sender)
(define-data-var metadata-initialized bool false)
(define-data-var token-name (string-ascii 32) "SATURN SHARE")
(define-data-var token-symbol (string-ascii 10) "SATSHARE")
(define-data-var token-decimals uint u6)
(define-data-var token-uri (optional (string-utf8 256)) none)
(define-data-var total-supply uint u0)

(define-map balances principal uint)

(define-private (assert-deployer)
  (let ((current-deployer (var-get deployer)))
    (if
      (and (is-eq tx-sender current-deployer) (is-eq contract-caller current-deployer))
      (ok true)
      (err ERR_UNAUTHORIZED)
    )
  )
)

(define-private (assert-vault)
  (let ((current-vault (var-get vault)))
    (if
      (or (is-eq tx-sender current-vault) (is-eq contract-caller current-vault))
      (ok true)
      (err ERR_UNAUTHORIZED)
    )
  )
)

(define-private (is-standard-principal (value principal))
  (match (principal-destruct? value)
    descriptor
    (is-none (get name descriptor))
    destruct-error
    false
  )
)

(define-private (credit (recipient principal) (amount uint))
  (map-set balances recipient (+ (default-to u0 (map-get? balances recipient)) amount))
)

(define-private (debit (owner principal) (amount uint))
  (let ((current-balance (default-to u0 (map-get? balances owner))))
    (begin
      (asserts! (>= current-balance amount) (err ERR_INSUFFICIENT_BALANCE))
      (map-set balances owner (- current-balance amount))
      (ok true)
    )
  )
)

(define-public (initialize-metadata
    (name (string-ascii 32))
    (symbol (string-ascii 10))
    (decimals uint)
  )
  (begin
    (try! (assert-deployer))
    (asserts! (not (var-get metadata-initialized)) (err ERR_ALREADY_INITIALIZED))
    (asserts! (> (len name) u0) (err ERR_INVALID_NAME))
    (asserts! (> (len symbol) u0) (err ERR_INVALID_SYMBOL))
    (asserts! (<= decimals u12) (err ERR_INVALID_DECIMALS))
    (var-set token-name name)
    (var-set token-symbol symbol)
    (var-set token-decimals decimals)
    (var-set metadata-initialized true)
    (ok true)
  )
)

(define-public (set-vault (vault-principal principal))
  (begin
    (try! (assert-deployer))
    (asserts! (is-eq vault-principal .saturn-vault) (err ERR_INVALID_VAULT))
    (var-set vault vault-principal)
    (ok vault-principal)
  )
)

(define-public (mint (amount uint) (recipient principal))
  (match (principal-destruct? recipient)
    descriptor
    (let ((checked-recipient
            (begin
              (asserts! (is-none (get name descriptor)) (err ERR_INVALID_RECIPIENT))
              (unwrap! (principal-construct? (get version descriptor) (get hash-bytes descriptor)) (err ERR_INVALID_RECIPIENT))
            )))
      (begin
        (try! (assert-vault))
        (asserts! (> amount u0) (err ERR_INVALID_AMOUNT))
        (credit checked-recipient amount)
        (var-set total-supply (+ (var-get total-supply) amount))
        (ok amount)
      )
    )
    destruct-error
    (err ERR_INVALID_RECIPIENT)
  )
)

(define-public (burn (amount uint) (owner principal))
  (match (principal-destruct? owner)
    descriptor
    (let ((checked-owner
            (begin
              (asserts! (is-none (get name descriptor)) (err ERR_INVALID_OWNER))
              (unwrap! (principal-construct? (get version descriptor) (get hash-bytes descriptor)) (err ERR_INVALID_OWNER))
            )))
      (begin
        (try! (assert-vault))
        (asserts! (> amount u0) (err ERR_INVALID_AMOUNT))
        (try! (debit checked-owner amount))
        (var-set total-supply (- (var-get total-supply) amount))
        (ok amount)
      )
    )
    destruct-error
    (err ERR_INVALID_OWNER)
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
      (asserts! (or (is-eq tx-sender sender) (is-eq contract-caller sender)) (err ERR_UNAUTHORIZED))
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
