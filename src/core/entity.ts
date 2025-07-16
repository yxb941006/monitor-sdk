import { INPReportOpts, ReportOpts } from "web-vitals";

export interface SDKInitConfig {
    /**
     * 上传数据的方法
     */
    customUploader: (data: string) => Promise<void>;
    /**
     * 是否启用错误日志记录
     * @default true 默认启用错误日志记录
     */
    enableErrorLogging?: boolean;
    /**
     * 需要监控的性能指标及其配置
     * 键为指标名称，值为布尔值（启用/禁用）或配置对象
     */
    performanceMetrics?: {
        [MetricName in keyof PerformanceMetrics]?: boolean | PerformanceMetrics[MetricName];
    };
}

/**
 * 性能指标的详细配置类型
 */
export interface PerformanceMetrics {
    fcp: {
        enabled: boolean;
    } & ReportOpts;

    cls: {
        enabled: boolean;
    } & ReportOpts;

    lcp: {
        enabled: boolean;
    } & ReportOpts;

    ttfb: {
        enabled: boolean;
    } & ReportOpts;

    inp: {
        enabled: boolean;
    } & INPReportOpts;
}
