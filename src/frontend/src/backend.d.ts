import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Position {
    horizontal: Alignment;
    vertical: Variant_top_middle_bottom;
}
export interface HeroContent {
    sectionBody: string;
    sectionTitle: string;
    bodyPosition: Position;
    imageSrc: string;
    imagePosition: Position;
    titlePosition: Position;
}
export interface Section {
    sectionBody: string;
    sectionTitle: string;
}
export interface WebsiteContent {
    siteTitle: string;
    heroSection: HeroContent;
    footerText: string;
    mainSection: Section;
}
export interface UserProfile {
    name: string;
}
export enum Alignment {
    center = "center",
    left = "left",
    right = "right"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_top_middle_bottom {
    top = "top",
    middle = "middle",
    bottom = "bottom"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDraftContent(): Promise<WebsiteContent>;
    getLiveContent(): Promise<WebsiteContent>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    publishDraft(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateDraftContent(newContent: WebsiteContent): Promise<void>;
}
