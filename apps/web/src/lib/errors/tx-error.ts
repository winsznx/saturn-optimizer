import { AppError } from "./base-error";

export class TxRejectedError extends AppError {
  readonly code = "TX_REJECTED";
}

export class TxTimeoutError extends AppError {
  readonly code = "TX_TIMEOUT";
}

export class TxRevertedError extends AppError {
  readonly code = "TX_REVERTED";
}
