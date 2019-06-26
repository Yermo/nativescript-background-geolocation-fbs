
declare const ACTIVITY_PROVIDER: number;

declare const DISTANCE_FILTER_PROVIDER: number;

interface MAHUncaughtExceptionLogger {
	setEnabled: interop.FunctionReference<(p1: boolean) => void>;
	isEnabled: interop.FunctionReference<() => boolean>;
}
declare var MAHUncaughtExceptionLogger: interop.StructType<MAHUncaughtExceptionLogger>;

declare class MAURActivity extends NSObject implements NSCopying {

	static alloc(): MAURActivity; // inherited from NSObject

	static new(): MAURActivity; // inherited from NSObject

	confidence: number;

	type: string;

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;

	toDictionary(): NSDictionary<any, any>;
}

declare const enum MAURBGErrorCode {

	PermissionDenied = 1000,

	SettingsError = 1001,

	ConfigureError = 1002,

	ServiceError = 1003,

	JsonError = 1004,

	NotImplemented = 9999
}

declare class MAURBackgroundGeolocationFacade extends NSObject {

	static alloc(): MAURBackgroundGeolocationFacade; // inherited from NSObject

	static locationTransform(): (p1: MAURLocation) => MAURLocation;

	static new(): MAURBackgroundGeolocationFacade; // inherited from NSObject

	static setLocationTransform(transform: (p1: MAURLocation) => MAURLocation): void;

	delegate: MAURProviderDelegate;

	authorizationStatus(): MAURLocationAuthorizationStatus;

	configureError(config: MAURConfig): boolean;

	deleteAllLocations(): boolean;

	deleteLocationError(locationId: number): boolean;

	forceSync(): void;

	getConfig(): MAURConfig;

	getCurrentLocationMaximumAgeEnableHighAccuracyError(timeout: number, maximumAge: number, enableHighAccuracy: boolean): MAURLocation;

	getLocations(): NSArray<MAURLocation>;

	getLogEntries(limit: number): NSArray<any>;

	getLogEntriesFromLogEntryIdMinLogLevelFromString(limit: number, entryId: number, minLogLevel: string): NSArray<any>;

	getStationaryLocation(): MAURLocation;

	getValidLocations(): NSArray<MAURLocation>;

	isStarted(): boolean;

	locationServicesEnabled(): boolean;

	onAppTerminate(): void;

	showAppSettings(): void;

	showLocationSettings(): void;

	start(): boolean;

	stop(): boolean;

	switchMode(mode: MAUROperationalMode): void;
}

declare class MAURBackgroundTaskManager extends NSObject {

	static alloc(): MAURBackgroundTaskManager; // inherited from NSObject

	static new(): MAURBackgroundTaskManager; // inherited from NSObject

	static sharedTasks(): any;

	beginTask(): number;

	beginTaskWithCompletionHandler(_completion: () => void): number;

	endTaskWithKey(_key: number): void;
}

declare class MAURConfig extends NSObject implements NSCopying {

	static alloc(): MAURConfig; // inherited from NSObject

	static fromDictionary(config: NSDictionary<any, any>): MAURConfig;

	static getDefaultTemplate(): NSDictionary<any, any>;

	static mergeWithConfig(config: MAURConfig, newConfig: MAURConfig): MAURConfig;

	static new(): MAURConfig; // inherited from NSObject

	_debug: number;

	_pauseLocationUpdates: number;

	_saveBatteryOnBackground: number;

	_stopOnTerminate: number;

	_template: NSObject;

	activitiesInterval: number;

	activityType: string;

	desiredAccuracy: number;

	distanceFilter: number;

	httpHeaders: NSMutableDictionary<any, any>;

	locationProvider: number;

	maxLocations: number;

	stationaryRadius: number;

	syncThreshold: number;

	syncUrl: string;

	url: string;

	constructor(o: { defaults: void; });

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;

	decodeActivityType(): CLActivityType;

	decodeDesiredAccuracy(): number;

	getHttpHeadersAsString(): string;

	getTemplateAsString(): string;

	hasActivitiesInterval(): boolean;

	hasActivityType(): boolean;

	hasDebug(): boolean;

	hasDesiredAccuracy(): boolean;

	hasDistanceFilter(): boolean;

	hasHttpHeaders(): boolean;

	hasLocationProvider(): boolean;

	hasMaxLocations(): boolean;

	hasPauseLocationUpdates(): boolean;

	hasSaveBatteryOnBackground(): boolean;

	hasStationaryRadius(): boolean;

	hasStopOnTerminate(): boolean;

	hasSyncThreshold(): boolean;

	hasSyncUrl(): boolean;

	hasTemplate(): boolean;

	hasUrl(): boolean;

	hasValidSyncUrl(): boolean;

	hasValidUrl(): boolean;

	initWithDefaults(): this;

	isDebugging(): boolean;

	pauseLocationUpdates(): boolean;

	saveBatteryOnBackground(): boolean;

	stopOnTerminate(): boolean;

	toDictionary(): NSDictionary<any, any>;
}

declare class MAURLocation extends NSObject implements NSCopying {

	static alloc(): MAURLocation; // inherited from NSObject

	static fromCLLocation(location: CLLocation): MAURLocation;

	static locationAge(location: CLLocation): number;

	static new(): MAURLocation; // inherited from NSObject

	static toDictionary(location: CLLocation): NSMutableDictionary<any, any>;

	accuracy: number;

	altitude: number;

	altitudeAccuracy: number;

	heading: number;

	isValid: boolean;

	latitude: number;

	locationId: number;

	locationProvider: number;

	longitude: number;

	provider: string;

	radius: number;

	recordedAt: Date;

	speed: number;

	time: Date;

	coordinate(): CLLocationCoordinate2D;

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;

	distanceFromLocation(location: MAURLocation): number;

	getValueForKey(key: any): any;

	hasAccuracy(): boolean;

	hasTime(): boolean;

	isBetterLocation(location: MAURLocation): boolean;

	isBeyondRadius(location: MAURLocation, radius: number): boolean;

	locationAge(): number;

	toDictionary(): NSDictionary<any, any>;

	toDictionaryWithId(): NSDictionary<any, any>;

	toResultFromTemplate(locationTemplate: any): any;
}

declare const enum MAURLocationAuthorizationStatus {

	Denied = 0,

	Allowed = 1,

	Always = 1,

	Foreground = 2,

	NotDetermined = 99
}

declare const enum MAURLocationStatus {

	Deleted = 0,

	PostPending = 1,

	SyncPending = 2
}

declare class MAURLogReader extends NSObject {

	static alloc(): MAURLogReader; // inherited from NSObject

	static new(): MAURLogReader; // inherited from NSObject

	constructor(o: { logDirectory: string; });

	getEntriesFromLogEntryIdMinLogLevel(limit: number, entryId: number, minLogLevel: any): NSArray<any>;

	getLogEntriesFromLogEntryIdMinLogLevelAsString(limit: number, offset: number, minLogLevel: string): NSArray<any>;

	initWithLogDirectory(aLogDirectory: string): this;

	prepareSQLFromLogEntryIdMinLogLevel(limit: number, entryId: number, minLogLevel: number): string;
}

declare const enum MAUROperationalMode {

	BackgroundMode = 0,

	ForegroundMode = 1
}

interface MAURProviderDelegate extends NSObjectProtocol {

	onAbortRequested(): void;

	onActivityChanged(activity: MAURActivity): void;

	onAuthorizationChanged(authStatus: MAURLocationAuthorizationStatus): void;

	onError(error: NSError): void;

	onHttpAuthorization(): void;

	onLocationChanged(location: MAURLocation): void;

	onLocationPause(): void;

	onLocationResume(): void;

	onStationaryChanged(location: MAURLocation): void;
}
declare var MAURProviderDelegate: {

	prototype: MAURProviderDelegate;
};

declare const RAW_PROVIDER: number;

declare function mah_get_uncaught_exception_logger(): interop.Pointer | interop.Reference<MAHUncaughtExceptionLogger>;
