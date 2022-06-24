

export class HistoryLoad extends CustomEvent {
	constructor(detail) {
		super(HistoryLoad.type, { detail });
	}

	static get type() {
		return 'historyload';
	}
}

export class EventsDispatcher {
	constructor(component) {
		this.dispatchEvent = component.dispatchEvent.bind(component);
	}

	historyLoad({
		purchaseOrderFlag,
		productListFlag,
	}) {
		this.dispatchEvent(
			new HistoryLoad({
                purchaseOrderFlag,
                productListFlag,
			})
		);
	}
}