(define-constant ERR_UNAUTHORIZED u100)
(define-constant ERR_INVALID_ADMIN u101)

(define-data-var admin principal tx-sender)
(define-data-var paused bool false)

(define-private (is-standard-principal (value principal))
  (match (principal-destruct? value)
    descriptor
    (is-none (get name descriptor))
    destruct-error
    false
  )
)

(define-private (assert-admin)
  (let ((current-admin (var-get admin)))
    (if
      (and (is-eq tx-sender current-admin) (is-eq contract-caller current-admin))
      (ok true)
      (err ERR_UNAUTHORIZED)
    )
  )
)

(define-public (pause)
  (begin
    (try! (assert-admin))
    (var-set paused true)
    (ok true)
  )
)

(define-public (unpause)
  (begin
    (try! (assert-admin))
    (var-set paused false)
    (ok true)
  )
)

(define-public (set-admin (new-admin principal))
  (begin
    (try! (assert-admin))
    (asserts! (is-standard-principal new-admin) (err ERR_INVALID_ADMIN))
    (var-set admin new-admin)
    (ok new-admin)
  )
)

(define-read-only (get-admin)
  (var-get admin)
)

(define-read-only (is-paused)
  (var-get paused)
)
