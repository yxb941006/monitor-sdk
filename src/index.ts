import { SDKInitConfig } from "./core/entity";
import { ErrorMonitor } from "./error-monitor";
import { PerformanceMonitor } from "./performance-monitor";

export const MonitorSDK = {
    init: (config: SDKInitConfig) => {
        const enableErrorLogging = config.enableErrorLogging ?? true;
        if (enableErrorLogging) {
            const errorMonitor = new ErrorMonitor(config.customUploader);
            errorMonitor.init();
        }
        const performanceMonitor = new PerformanceMonitor(config.performanceMetrics, config.customUploader);
        performanceMonitor.init();
    },
};

export * from './public-api';
