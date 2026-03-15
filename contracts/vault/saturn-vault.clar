;; Saturn vault MVP.
;;
;; Security boundary:
;; - User deposits and withdrawals terminate at this contract.
;; - Strategies and adapters are exact-principal implementation details selected by
;;   the vault rather than user-supplied plugins.
;;
;; Mock integration model:
;; - Managed exposure is represented by strategy/adaptor position counters so the repo
;;   can prove auth, pause handling, and accounting invariants in simnet.
;; - Live upstream token movement is intentionally deferred to the integration phase.
(define-constant ERR_UNAUTHORIZED u400)
(define-constant ERR_PAUSED u401)
(define-constant ERR_INVALID_AMOUNT u402)
(define-constant ERR_STRATEGY_NOT_APPROVED u403)
(define-constant ERR_ADAPTER_NOT_APPROVED u404)
(define-constant ERR_INVALID_STRATEGY u405)
(define-constant ERR_INVALID_ADAPTER u406)
(define-constant ERR_INSUFFICIENT_LIQUIDITY u407)
(define-constant ERR_TRANSFER_FAILED u408)
(define-constant ERR_BURN_FAILED u409)
(define-constant ERR_MINT_FAILED u410)
(define-constant ERR_INVALID_KEEPER u411)

(define-constant SBTC-TOKEN .mock-sbtc)
(define-constant SBTC-SHARE-TOKEN .vault-shares-sbtc)
(define-constant STX-SHARE-TOKEN .vault-shares-stx)
(define-constant PAUSE-CONTRACT .emergency-pause)
(define-constant SELF .saturn-vault)
(define-constant CONSERVATIVE-STRATEGY .conservative-strategy)
(define-constant BALANCED-STRATEGY .balanced-strategy)
(define-constant ZEST-ADAPTER .zest-adapter)
(define-constant STACKINGDAO-ADAPTER .stackingdao-adapter)
(define-constant BITFLOW-ADAPTER .bitflow-adapter)

(define-data-var admin principal tx-sender)
(define-data-var keeper principal tx-sender)
(define-data-var active-strategy principal CONSERVATIVE-STRATEGY)
(define-data-var idle-sbtc uint u0)
(define-data-var idle-stx uint u0)
(define-data-var managed-sbtc uint u0)
(define-data-var managed-stx uint u0)
(define-data-var managed-ststx uint u0)
(define-data-var total-sbtc-shares uint u0)
(define-data-var total-stx-shares uint u0)

(define-map approved-strategies principal bool)
(define-map approved-adapters principal bool)
(define-map sbtc-user-shares principal uint)
(define-map stx-user-shares principal uint)

(define-private (is-supported-strategy (strategy principal))
  (or (is-eq strategy CONSERVATIVE-STRATEGY) (is-eq strategy BALANCED-STRATEGY))
)

(define-private (is-supported-adapter (adapter principal))
  (or
    (is-eq adapter ZEST-ADAPTER)
    (is-eq adapter STACKINGDAO-ADAPTER)
    (is-eq adapter BITFLOW-ADAPTER)
  )
)

(define-private (is-approved-strategy (strategy principal))
  (default-to false (map-get? approved-strategies strategy))
)

(define-private (is-approved-adapter (adapter principal))
  (default-to false (map-get? approved-adapters adapter))
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

(define-private (is-standard-principal (value principal))
  (match (principal-destruct? value)
    descriptor
    (is-none (get name descriptor))
    destruct-error
    false
  )
)

(define-private (assert-operator)
  (let (
      (current-admin (var-get admin))
      (current-keeper (var-get keeper))
    )
    (if
      (and
        (is-eq tx-sender contract-caller)
        (or (is-eq tx-sender current-admin) (is-eq tx-sender current-keeper))
      )
      (ok true)
      (err ERR_UNAUTHORIZED)
    )
  )
)

(define-private (assert-not-paused)
  (if
    (not (contract-call? .emergency-pause is-paused))
    (ok true)
    (err ERR_PAUSED)
  )
)

(define-private (ensure-liquidity (available uint) (required uint))
  (if (>= available required) (ok true) (err ERR_INSUFFICIENT_LIQUIDITY))
)

(define-private (required-adapters-approved (strategy principal))
  (if (is-eq strategy CONSERVATIVE-STRATEGY)
    (if (is-approved-adapter STACKINGDAO-ADAPTER) (ok true) (err ERR_ADAPTER_NOT_APPROVED))
    (if
      (and (is-approved-adapter ZEST-ADAPTER) (is-approved-adapter BITFLOW-ADAPTER))
      (ok true)
      (err ERR_ADAPTER_NOT_APPROVED)
    )
  )
)

(define-private (call-deploy-idle (strategy principal) (sbtc-amount uint) (stx-amount uint))
  (if (is-eq strategy CONSERVATIVE-STRATEGY)
    (contract-call? .conservative-strategy deploy-idle sbtc-amount stx-amount)
    (contract-call? .balanced-strategy deploy-idle sbtc-amount stx-amount)
  )
)

(define-private (call-free-assets (strategy principal) (sbtc-needed uint) (stx-needed uint))
  (if (is-eq strategy CONSERVATIVE-STRATEGY)
    (contract-call? .conservative-strategy free-assets sbtc-needed stx-needed)
    (contract-call? .balanced-strategy free-assets sbtc-needed stx-needed)
  )
)

(define-private (call-harvest (strategy principal))
  (if (is-eq strategy CONSERVATIVE-STRATEGY)
    (contract-call? .conservative-strategy harvest)
    (contract-call? .balanced-strategy harvest)
  )
)

(define-private (burn-sbtc-shares (amount uint) (owner principal))
  (contract-call? .vault-shares-sbtc burn amount owner)
)

(define-private (burn-stx-shares (amount uint) (owner principal))
  (contract-call? .vault-shares-stx burn amount owner)
)

(define-private (mint-sbtc-shares (amount uint) (recipient principal))
  (contract-call? .vault-shares-sbtc mint amount recipient)
)

(define-private (mint-stx-shares (amount uint) (recipient principal))
  (contract-call? .vault-shares-stx mint amount recipient)
)

(define-private (send-sbtc (amount uint) (recipient principal))
  (contract-call? .mock-sbtc transfer amount SELF recipient none)
)

(define-private (send-stx (amount uint) (recipient principal))
  (as-contract? ((with-stx amount))
    (try! (stx-transfer? amount SELF recipient))
    amount
  )
)

(define-public (set-keeper (new-keeper principal))
  (begin
    (try! (assert-admin))
    (asserts! (is-standard-principal new-keeper) (err ERR_INVALID_KEEPER))
    (var-set keeper new-keeper)
    (ok new-keeper)
  )
)

(define-public (set-strategy-approved (strategy principal) (approved bool))
  (begin
    (try! (assert-admin))
    (asserts! (is-supported-strategy strategy) (err ERR_INVALID_STRATEGY))
    (map-set approved-strategies strategy approved)
    (ok approved)
  )
)

(define-public (set-adapter-approved (adapter principal) (approved bool))
  (begin
    (try! (assert-admin))
    (asserts! (is-supported-adapter adapter) (err ERR_INVALID_ADAPTER))
    (map-set approved-adapters adapter approved)
    (ok approved)
  )
)

(define-public (set-active-strategy (strategy principal))
  (begin
    (try! (assert-admin))
    (asserts! (is-supported-strategy strategy) (err ERR_INVALID_STRATEGY))
    (asserts! (is-approved-strategy strategy) (err ERR_STRATEGY_NOT_APPROVED))
    (try! (required-adapters-approved strategy))
    (var-set active-strategy strategy)
    (ok strategy)
  )
)

(define-public (deposit-sbtc (amount uint))
  (let ((vault-principal SELF))
    (begin
      (try! (assert-not-paused))
      (asserts! (> amount u0) (err ERR_INVALID_AMOUNT))
      (try! (contract-call? .mock-sbtc transfer amount tx-sender vault-principal none))
      (try! (mint-sbtc-shares amount tx-sender))
      (var-set idle-sbtc (+ (var-get idle-sbtc) amount))
      (var-set total-sbtc-shares (+ (var-get total-sbtc-shares) amount))
      (map-set sbtc-user-shares tx-sender (+ (default-to u0 (map-get? sbtc-user-shares tx-sender)) amount))
      (ok amount)
    )
  )
)

(define-public (deposit-stx (amount uint))
  (let ((vault-principal SELF))
    (begin
      (try! (assert-not-paused))
      (asserts! (> amount u0) (err ERR_INVALID_AMOUNT))
      (try! (stx-transfer? amount tx-sender vault-principal))
      (try! (mint-stx-shares amount tx-sender))
      (var-set idle-stx (+ (var-get idle-stx) amount))
      (var-set total-stx-shares (+ (var-get total-stx-shares) amount))
      (map-set stx-user-shares tx-sender (+ (default-to u0 (map-get? stx-user-shares tx-sender)) amount))
      (ok amount)
    )
  )
)

(define-public (rebalance)
  (let (
      (strategy (var-get active-strategy))
      (sbtc-amount (var-get idle-sbtc))
      (stx-amount (var-get idle-stx))
    )
    (begin
      (try! (assert-operator))
      (try! (assert-not-paused))
      (asserts! (is-approved-strategy strategy) (err ERR_STRATEGY_NOT_APPROVED))
      (try! (required-adapters-approved strategy))
      (match (call-deploy-idle strategy sbtc-amount stx-amount) deployment
        (begin
          (var-set idle-sbtc (- (var-get idle-sbtc) (get sbtc-used deployment)))
          (var-set managed-sbtc (+ (var-get managed-sbtc) (get sbtc-used deployment)))
          (var-set idle-stx (- (var-get idle-stx) (get stx-used deployment)))
          (if (is-eq strategy CONSERVATIVE-STRATEGY)
            (var-set managed-ststx (+ (var-get managed-ststx) (get stx-used deployment)))
            (var-set managed-stx (+ (var-get managed-stx) (get stx-used deployment)))
          )
          (ok deployment)
        )
        err-code
        (err err-code)
      )
    )
  )
)

(define-public (harvest)
  (let ((strategy (var-get active-strategy)))
    (begin
      (try! (assert-operator))
      (try! (assert-not-paused))
      (asserts! (is-approved-strategy strategy) (err ERR_STRATEGY_NOT_APPROVED))
      (try! (required-adapters-approved strategy))
      (call-harvest strategy)
    )
  )
)

(define-public (withdraw-sbtc (shares uint))
  (let (
      (recipient tx-sender)
      (available (var-get idle-sbtc))
      (managed (var-get managed-sbtc))
      (strategy (var-get active-strategy))
    )
    (begin
      (try! (assert-not-paused))
      (asserts! (> shares u0) (err ERR_INVALID_AMOUNT))
      (try!
        (if (< available shares)
          (let ((needed (- shares available)))
            (begin
              (asserts! (>= managed needed) (err ERR_INSUFFICIENT_LIQUIDITY))
              (match (call-free-assets strategy needed u0) released
                (begin
                  (var-set managed-sbtc (- (var-get managed-sbtc) (get sbtc-freed released)))
                  (var-set idle-sbtc (+ (var-get idle-sbtc) (get sbtc-freed released)))
                  (ok true)
                )
                err-code
                (err err-code)
              )
            )
          )
          (ok true)
        )
      )
      (try! (ensure-liquidity (var-get idle-sbtc) shares))
      (try! (burn-sbtc-shares shares recipient))
      (try! (send-sbtc shares recipient))
      (var-set idle-sbtc (- (var-get idle-sbtc) shares))
      (var-set total-sbtc-shares (- (var-get total-sbtc-shares) shares))
      (map-set sbtc-user-shares recipient (- (default-to u0 (map-get? sbtc-user-shares recipient)) shares))
      (ok shares)
    )
  )
)

(define-public (withdraw-stx (shares uint))
  (let (
      (recipient tx-sender)
      (available (var-get idle-stx))
      (managed (var-get managed-stx))
      (strategy (var-get active-strategy))
    )
    (begin
      (try! (assert-not-paused))
      (asserts! (> shares u0) (err ERR_INVALID_AMOUNT))
      (try!
        (if (< available shares)
          (let ((needed (- shares available)))
            (begin
              (asserts!
                (>= (+ (var-get managed-stx) (var-get managed-ststx)) needed)
                (err ERR_INSUFFICIENT_LIQUIDITY)
              )
              (match (call-free-assets strategy u0 needed) released
                (begin
                  (if (is-eq strategy CONSERVATIVE-STRATEGY)
                    (var-set managed-ststx (- (var-get managed-ststx) (get stx-freed released)))
                    (var-set managed-stx (- (var-get managed-stx) (get stx-freed released)))
                  )
                  (var-set idle-stx (+ (var-get idle-stx) (get stx-freed released)))
                  (ok true)
                )
                err-code
                (err err-code)
              )
            )
          )
          (ok true)
        )
      )
      (try! (ensure-liquidity (var-get idle-stx) shares))
      (try! (burn-stx-shares shares recipient))
      (try! (send-stx shares recipient))
      (var-set idle-stx (- (var-get idle-stx) shares))
      (var-set total-stx-shares (- (var-get total-stx-shares) shares))
      (map-set stx-user-shares recipient (- (default-to u0 (map-get? stx-user-shares recipient)) shares))
      (ok shares)
    )
  )
)

(define-public (safe-withdraw-sbtc (shares uint))
  (let ((recipient tx-sender))
    (begin
      (asserts! (> shares u0) (err ERR_INVALID_AMOUNT))
      (try! (ensure-liquidity (var-get idle-sbtc) shares))
      (try! (burn-sbtc-shares shares recipient))
      (try! (send-sbtc shares recipient))
      (var-set idle-sbtc (- (var-get idle-sbtc) shares))
      (var-set total-sbtc-shares (- (var-get total-sbtc-shares) shares))
      (map-set sbtc-user-shares recipient (- (default-to u0 (map-get? sbtc-user-shares recipient)) shares))
      (ok shares)
    )
  )
)

(define-public (safe-withdraw-stx (shares uint))
  (let ((recipient tx-sender))
    (begin
      (asserts! (> shares u0) (err ERR_INVALID_AMOUNT))
      (try! (ensure-liquidity (var-get idle-stx) shares))
      (try! (burn-stx-shares shares recipient))
      (try! (send-stx shares recipient))
      (var-set idle-stx (- (var-get idle-stx) shares))
      (var-set total-stx-shares (- (var-get total-stx-shares) shares))
      (map-set stx-user-shares recipient (- (default-to u0 (map-get? stx-user-shares recipient)) shares))
      (ok shares)
    )
  )
)

(define-read-only (get-user-position (owner principal))
  (ok {
    sbtc-shares: (default-to u0 (map-get? sbtc-user-shares owner)),
    stx-shares: (default-to u0 (map-get? stx-user-shares owner))
  })
)

(define-read-only (get-vault-balances)
  (ok {
    idle-sbtc: (var-get idle-sbtc),
    idle-stx: (var-get idle-stx),
    managed-sbtc: (var-get managed-sbtc),
    managed-stx: (var-get managed-stx),
    managed-ststx: (var-get managed-ststx)
  })
)

(define-read-only (get-managed-balances)
  (ok {
    sbtc: (var-get managed-sbtc),
    stx: (var-get managed-stx),
    ststx: (var-get managed-ststx)
  })
)

(define-read-only (get-total-shares)
  (ok {
    sbtc: (var-get total-sbtc-shares),
    stx: (var-get total-stx-shares)
  })
)

(define-read-only (get-admin)
  (var-get admin)
)

(define-read-only (get-keeper)
  (var-get keeper)
)

(define-read-only (get-active-strategy)
  (var-get active-strategy)
)

(define-read-only (is-strategy-approved-read (strategy principal))
  (is-approved-strategy strategy)
)

(define-read-only (is-adapter-approved-read (adapter principal))
  (is-approved-adapter adapter)
)

(define-public (is-paused)
  (ok (contract-call? .emergency-pause is-paused))
)
