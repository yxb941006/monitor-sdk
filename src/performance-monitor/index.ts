import { onFCP, onCLS, onLCP, onINP, onTTFB, MetricType } from "web-vitals";
import { PerformanceMetrics, SDKInitConfig } from "../public-api";

export class PerformanceMonitor {
    private _metrics: SDKInitConfig["performanceMetrics"];
    private _uploader: (metric: MetricType) => void;
    constructor(metrics: SDKInitConfig["performanceMetrics"], uploader: SDKInitConfig["customUploader"]) {
        this._metrics = metrics;
        this._uploader = (metric) => {
            uploader(
                JSON.stringify({
                    [metric.name]: metric,
                })
            );
        };
    }

    // 初始化性能监控
    init() {
        if (!this._metrics) {
            throw Error("请先传入需要监控的性能指标");
        }
        Object.entries(this._metrics).forEach(([metricName, config]) => {
            if (config) {
                this.startTracking(metricName as keyof PerformanceMetrics, config);
            }
        });
    }

    private startTracking(metricName: keyof PerformanceMetrics, config: boolean | PerformanceMetrics[keyof PerformanceMetrics]) {
        let enabled = false;
        let performanceConfig;
        if (typeof config === "boolean") {
            enabled = config;
        } else {
            const { enabled: configEnabled, ...result } = config;
            enabled = configEnabled;
            performanceConfig = result;
        }
        switch (metricName) {
            case "fcp":
                onFCP(this._uploader, performanceConfig);
                break;
            case "cls":
                onCLS(this._uploader, performanceConfig);
                break;
            case "inp":
                onINP(this._uploader, performanceConfig);
                break;
            case "lcp":
                onLCP(this._uploader, performanceConfig);
                break;
            case "ttfb":
                onTTFB(this._uploader, performanceConfig);
                break;
            default:
                break;
        }
    }
}
