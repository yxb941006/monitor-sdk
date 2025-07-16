import { SDKInitConfig } from "../public-api";

export class ErrorMonitor {
    private _uploader: SDKInitConfig["customUploader"];
    constructor(uploader: SDKInitConfig["customUploader"]) {
        this._uploader = uploader;
    }

    private serializeErrorEvent(event) {
        return {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            type: event.type,
            timestamp: event.timeStamp,
            error: event.error
                ? {
                      name: event.error.name,
                      message: event.error.message,
                      stack: event.error.stack,
                  }
                : undefined,
        };
    }

    init() {
        window.addEventListener("error", (e) => {
            this._uploader(JSON.stringify({ error: this.serializeErrorEvent(e) }));
        });
    }
}
