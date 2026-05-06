export type TenantContext = {
    tenantId: string;
    membershipRole: string;
};
export declare const CurrentTenant: (...dataOrPipes: unknown[]) => ParameterDecorator;
