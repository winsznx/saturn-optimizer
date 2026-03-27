;; Saturn Governance (Emergency Pause)
;; Deployer is admin. Toggle pause state freely.

(define-constant ERR_UNAUTHORIZED u100)

(define-data-var admin principal tx-sender)
(define-data-var paused bool false)

(define-private (assert-admin)
  (if (is-eq tx-sender (var-get admin))
    (ok true)
    (err ERR_UNAUTHORIZED)
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
