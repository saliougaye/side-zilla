type ExceptionType = "NOT_FOUND" | "UNEXPECTED";

class Exception {
	private type: ExceptionType;
	private message: string;

	constructor(type: ExceptionType, message: string) {
		this.type = type;
		this.message = message;
	}

	get getStatusCode(): number {
		switch (this.type) {
			case "NOT_FOUND":
				return 404;
			default:
				return 500;
		}
	}

	get getMessage(): string {
		return this.message;
	}
}

export default Exception;
