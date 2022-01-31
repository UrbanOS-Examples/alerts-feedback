export class Feedback {
    constructor(
        public readonly alertId: string,
        public readonly isCongestion: boolean,
    ) {}
}
