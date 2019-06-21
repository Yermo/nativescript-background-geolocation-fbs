
declare const ACTIVITY_PROVIDER: number;

declare class DDASLLogCapture extends NSObject {

	static alloc(): DDASLLogCapture; // inherited from NSObject

	static captureLevel(): DDLogLevel;

	static new(): DDASLLogCapture; // inherited from NSObject

	static setCaptureLevel(level: DDLogLevel): void;

	static start(): void;

	static stop(): void;
}

declare class DDASLLogger extends DDAbstractLogger implements DDLogger {

	static alloc(): DDASLLogger; // inherited from NSObject

	static new(): DDASLLogger; // inherited from NSObject

	static sharedInstance(): DDASLLogger;

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	logFormatter: DDLogFormatter; // inherited from DDLogger

	readonly loggerName: string; // inherited from DDLogger

	readonly loggerQueue: NSObject; // inherited from DDLogger

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	didAddLogger(): void;

	flush(): void;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	logMessage(logMessage: DDLogMessage): void;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	willRemoveLogger(): void;
}

declare class DDAbstractDatabaseLogger extends DDAbstractLogger {

	static alloc(): DDAbstractDatabaseLogger; // inherited from NSObject

	static new(): DDAbstractDatabaseLogger; // inherited from NSObject

	deleteInterval: number;

	deleteOnEverySave: boolean;

	maxAge: number;

	saveInterval: number;

	saveThreshold: number;

	deleteOldLogEntries(): void;

	savePendingLogEntries(): void;
}

declare class DDAbstractLogger extends NSObject implements DDLogger {

	static alloc(): DDAbstractLogger; // inherited from NSObject

	static new(): DDAbstractLogger; // inherited from NSObject

	loggerQueue: NSObject;

	readonly onGlobalLoggingQueue: boolean;

	readonly onInternalLoggerQueue: boolean;

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	logFormatter: DDLogFormatter; // inherited from DDLogger

	readonly loggerName: string; // inherited from DDLogger

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	didAddLogger(): void;

	flush(): void;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	logMessage(logMessage: DDLogMessage): void;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	willRemoveLogger(): void;
}

declare function DDExtractFileNameWithoutExtension(filePath: string, copy: boolean): string;

declare class DDFileLogger extends DDAbstractLogger implements DDLogger {

	static alloc(): DDFileLogger; // inherited from NSObject

	static new(): DDFileLogger; // inherited from NSObject

	automaticallyAppendNewlineForCustomFormatters: boolean;

	doNotReuseLogFiles: boolean;

	readonly logFileManager: DDLogFileManager;

	maximumFileSize: number;

	rollingFrequency: number;

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	logFormatter: DDLogFormatter; // inherited from DDLogger

	readonly loggerName: string; // inherited from DDLogger

	readonly loggerQueue: NSObject; // inherited from DDLogger

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	constructor(o: { logFileManager: DDLogFileManager; });

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	currentLogFileInfo(): DDLogFileInfo;

	didAddLogger(): void;

	flush(): void;

	initWithLogFileManager(logFileManager: DDLogFileManager): this;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	logMessage(logMessage: DDLogMessage): void;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	rollLogFile(): void;

	rollLogFileWithCompletionBlock(completionBlock: () => void): void;

	self(): this;

	willRemoveLogger(): void;
}

declare class DDLog extends NSObject {

	static addLogger(logger: DDLogger): void;

	static addLoggerWithLevel(logger: DDLogger, level: DDLogLevel): void;

	static allLoggers(): NSArray<any>;

	static alloc(): DDLog; // inherited from NSObject

	static flushLog(): void;

	static levelForClass(aClass: typeof NSObject): DDLogLevel;

	static levelForClassWithName(aClassName: string): DDLogLevel;

	static logMessage(asynchronous: boolean, logMessage: DDLogMessage): void;

	static loggingQueue(): NSObject;

	static new(): DDLog; // inherited from NSObject

	static registeredClassNames(): NSArray<any>;

	static registeredClasses(): NSArray<any>;

	static removeAllLoggers(): void;

	static removeLogger(logger: DDLogger): void;

	static setLevelForClass(level: DDLogLevel, aClass: typeof NSObject): void;

	static setLevelForClassWithName(level: DDLogLevel, aClassName: string): void;

	static sharedInstance(): DDLog;

	addLogger(logger: DDLogger): void;

	addLoggerWithLevel(logger: DDLogger, level: DDLogLevel): void;

	allLoggers(): NSArray<any>;

	flushLog(): void;

	logMessage(asynchronous: boolean, logMessage: DDLogMessage): void;

	removeAllLoggers(): void;

	removeLogger(logger: DDLogger): void;
}

declare class DDLogFileFormatterDefault extends NSObject implements DDLogFormatter {

	static alloc(): DDLogFileFormatterDefault; // inherited from NSObject

	static new(): DDLogFileFormatterDefault; // inherited from NSObject

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	constructor(o: { dateFormatter: NSDateFormatter; });

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	didAddToLogger(logger: DDLogger): void;

	formatLogMessage(logMessage: DDLogMessage): string;

	initWithDateFormatter(dateFormatter: NSDateFormatter): this;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	willRemoveFromLogger(logger: DDLogger): void;
}

declare class DDLogFileInfo extends NSObject {

	static alloc(): DDLogFileInfo; // inherited from NSObject

	static logFileWithPath(filePath: string): DDLogFileInfo;

	static new(): DDLogFileInfo; // inherited from NSObject

	readonly age: number;

	readonly creationDate: Date;

	readonly fileAttributes: NSDictionary<any, any>;

	readonly fileName: string;

	readonly filePath: string;

	readonly fileSize: number;

	isArchived: boolean;

	readonly modificationDate: Date;

	constructor(o: { filePath: string; });

	addExtensionAttributeWithName(attrName: string): void;

	hasExtensionAttributeWithName(attrName: string): boolean;

	initWithFilePath(filePath: string): this;

	removeExtensionAttributeWithName(attrName: string): void;

	renameFile(newFileName: string): void;

	reset(): void;

	reverseCompareByCreationDate(another: DDLogFileInfo): NSComparisonResult;

	reverseCompareByModificationDate(another: DDLogFileInfo): NSComparisonResult;
}

interface DDLogFileManager extends NSObjectProtocol {

	logFilesDiskQuota: number;

	maximumNumberOfLogFiles: number;

	createNewLogFile(): string;

	didArchiveLogFile?(logFilePath: string): void;

	didRollAndArchiveLogFile?(logFilePath: string): void;

	logsDirectory(): string;

	sortedLogFileInfos(): NSArray<any>;

	sortedLogFileNames(): NSArray<any>;

	sortedLogFilePaths(): NSArray<any>;

	unsortedLogFileInfos(): NSArray<any>;

	unsortedLogFileNames(): NSArray<any>;

	unsortedLogFilePaths(): NSArray<any>;
}
declare var DDLogFileManager: {

	prototype: DDLogFileManager;
};

declare class DDLogFileManagerDefault extends NSObject implements DDLogFileManager {

	static alloc(): DDLogFileManagerDefault; // inherited from NSObject

	static new(): DDLogFileManagerDefault; // inherited from NSObject

	readonly newLogFileName: string;

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	logFilesDiskQuota: number; // inherited from DDLogFileManager

	maximumNumberOfLogFiles: number; // inherited from DDLogFileManager

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	constructor(o: { logsDirectory: string; });

	constructor(o: { logsDirectory: string; defaultFileProtectionLevel: string; });

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	createNewLogFile(): string;

	didArchiveLogFile(logFilePath: string): void;

	didRollAndArchiveLogFile(logFilePath: string): void;

	initWithLogsDirectory(logsDirectory: string): this;

	initWithLogsDirectoryDefaultFileProtectionLevel(logsDirectory: string, fileProtectionLevel: string): this;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isLogFile(fileName: string): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	logsDirectory(): string;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	sortedLogFileInfos(): NSArray<any>;

	sortedLogFileNames(): NSArray<any>;

	sortedLogFilePaths(): NSArray<any>;

	unsortedLogFileInfos(): NSArray<any>;

	unsortedLogFileNames(): NSArray<any>;

	unsortedLogFilePaths(): NSArray<any>;
}

declare const enum DDLogFlag {

	Error = 1,

	Warning = 2,

	Info = 4,

	Debug = 8,

	Verbose = 16
}

interface DDLogFormatter extends NSObjectProtocol {

	didAddToLogger?(logger: DDLogger): void;

	formatLogMessage(logMessage: DDLogMessage): string;

	willRemoveFromLogger?(logger: DDLogger): void;
}
declare var DDLogFormatter: {

	prototype: DDLogFormatter;
};

declare const enum DDLogLevel {

	Off = 0,

	Error = 1,

	Warning = 3,

	Info = 7,

	Debug = 15,

	Verbose = 31,

	All = 4294967295
}

declare class DDLogMessage extends NSObject implements NSCopying {

	static alloc(): DDLogMessage; // inherited from NSObject

	static new(): DDLogMessage; // inherited from NSObject

	readonly context: number;

	readonly file: string;

	readonly fileName: string;

	readonly flag: DDLogFlag;

	readonly function: string;

	readonly level: DDLogLevel;

	readonly line: number;

	readonly message: string;

	readonly options: DDLogMessageOptions;

	readonly queueLabel: string;

	readonly tag: any;

	readonly threadID: string;

	readonly threadName: string;

	readonly timestamp: Date;

	constructor(o: { message: string; level: DDLogLevel; flag: DDLogFlag; context: number; file: string; function: string; line: number; tag: any; options: DDLogMessageOptions; timestamp: Date; });

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;

	initWithMessageLevelFlagContextFileFunctionLineTagOptionsTimestamp(message: string, level: DDLogLevel, flag: DDLogFlag, context: number, file: string, _function: string, line: number, tag: any, options: DDLogMessageOptions, timestamp: Date): this;
}

declare const enum DDLogMessageOptions {

	CopyFile = 1,

	CopyFunction = 2
}

interface DDLogger extends NSObjectProtocol {

	logFormatter: DDLogFormatter;

	loggerName?: string;

	loggerQueue?: NSObject;

	didAddLogger?(): void;

	flush?(): void;

	logMessage(logMessage: DDLogMessage): void;

	willRemoveLogger?(): void;
}
declare var DDLogger: {

	prototype: DDLogger;
};

interface DDRegisteredDynamicLogging {
}
declare var DDRegisteredDynamicLogging: {

	prototype: DDRegisteredDynamicLogging;

	ddLogLevel(): DDLogLevel;

	ddSetLogLevel(level: DDLogLevel): void;
};

declare class DDTTYLogger extends DDAbstractLogger implements DDLogger {

	static alloc(): DDTTYLogger; // inherited from NSObject

	static new(): DDTTYLogger; // inherited from NSObject

	static sharedInstance(): DDTTYLogger;

	automaticallyAppendNewlineForCustomFormatters: boolean;

	colorsEnabled: boolean;

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	logFormatter: DDLogFormatter; // inherited from DDLogger

	readonly loggerName: string; // inherited from DDLogger

	readonly loggerQueue: NSObject; // inherited from DDLogger

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	class(): typeof NSObject;

	clearAllColors(): void;

	clearColorsForAllFlags(): void;

	clearColorsForAllTags(): void;

	clearColorsForFlag(mask: DDLogFlag): void;

	clearColorsForFlagContext(mask: DDLogFlag, context: number): void;

	clearColorsForTag(tag: any): void;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	didAddLogger(): void;

	flush(): void;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	logMessage(logMessage: DDLogMessage): void;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	setForegroundColorBackgroundColorForFlag(txtColor: UIColor, bgColor: UIColor, mask: DDLogFlag): void;

	setForegroundColorBackgroundColorForFlagContext(txtColor: UIColor, bgColor: UIColor, mask: DDLogFlag, ctxt: number): void;

	setForegroundColorBackgroundColorForTag(txtColor: UIColor, bgColor: UIColor, tag: any): void;

	willRemoveLogger(): void;
}

declare const DISTANCE_FILTER_PROVIDER: number;

declare class FMDBLogger extends DDAbstractDatabaseLogger implements DDLogger {

	static alloc(): FMDBLogger; // inherited from NSObject

	static new(): FMDBLogger; // inherited from NSObject

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	logFormatter: DDLogFormatter; // inherited from DDLogger

	readonly loggerName: string; // inherited from DDLogger

	readonly loggerQueue: NSObject; // inherited from DDLogger

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	constructor(o: { logDirectory: string; });

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	didAddLogger(): void;

	flush(): void;

	initWithLogDirectory(logDirectory: string): this;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	logMessage(logMessage: DDLogMessage): void;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	willRemoveLogger(): void;
}

declare class FMDatabase extends NSObject {

	static FMDBUserVersion(): string;

	static FMDBVersion(): number;

	static alloc(): FMDatabase; // inherited from NSObject

	static databaseWithPath(inPath: string): FMDatabase;

	static isSQLiteThreadSafe(): boolean;

	static new(): FMDatabase; // inherited from NSObject

	static sqliteLibVersion(): string;

	static storeableDateFormat(format: string): NSDateFormatter;

	cachedStatements: NSMutableDictionary<any, any>;

	checkedOut: boolean;

	crashOnErrors: boolean;

	logsErrors: boolean;

	traceExecution: boolean;

	constructor(o: { path: string; });

	applicationID(): number;

	beginDeferredTransaction(): boolean;

	beginTransaction(): boolean;

	changes(): number;

	clearCachedStatements(): void;

	close(): boolean;

	closeOpenResultSets(): void;

	columnExistsColumnName(tableName: string, columnName: string): boolean;

	columnExistsInTableWithName(columnName: string, tableName: string): boolean;

	commit(): boolean;

	databasePath(): string;

	dateFromString(s: string): Date;

	executeQueryValuesError(sql: string, values: NSArray<any> | any[]): FMResultSet;

	executeQueryWithArgumentsInArray(sql: string, _arguments: NSArray<any> | any[]): FMResultSet;

	executeQueryWithParameterDictionary(sql: string, _arguments: NSDictionary<any, any>): FMResultSet;

	executeStatements(sql: string): boolean;

	executeStatementsWithResultBlock(sql: string, block: (p1: NSDictionary<any, any>) => number): boolean;

	executeUpdateValuesError(sql: string, values: NSArray<any> | any[]): boolean;

	executeUpdateWithArgumentsInArray(sql: string, _arguments: NSArray<any> | any[]): boolean;

	executeUpdateWithParameterDictionary(sql: string, _arguments: NSDictionary<any, any>): boolean;

	getSchema(): FMResultSet;

	getTableSchema(tableName: string): FMResultSet;

	goodConnection(): boolean;

	hadError(): boolean;

	hasDateFormatter(): boolean;

	hasOpenResultSets(): boolean;

	inSavePoint(block: (p1: interop.Pointer | interop.Reference<boolean>) => void): NSError;

	inTransaction(): boolean;

	initWithPath(inPath: string): this;

	interrupt(): boolean;

	lastError(): NSError;

	lastErrorCode(): number;

	lastErrorMessage(): string;

	lastInsertRowId(): number;

	makeFunctionNamedMaximumArgumentsWithBlock(name: string, count: number, block: (p1: interop.Pointer | interop.Reference<any>, p2: number, p3: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>) => void): void;

	maxBusyRetryTimeInterval(): number;

	open(): boolean;

	openWithFlags(flags: number): boolean;

	openWithFlagsVfs(flags: number, vfsName: string): boolean;

	rekey(key: string): boolean;

	rekeyWithData(keyData: NSData): boolean;

	releaseSavePointWithNameError(name: string): boolean;

	rollback(): boolean;

	rollbackToSavePointWithNameError(name: string): boolean;

	setApplicationID(appID: number): void;

	setDateFormat(format: NSDateFormatter): void;

	setKey(key: string): boolean;

	setKeyWithData(keyData: NSData): boolean;

	setMaxBusyRetryTimeInterval(timeoutInSeconds: number): void;

	setShouldCacheStatements(value: boolean): void;

	setUserVersion(version: number): void;

	shouldCacheStatements(): boolean;

	sqliteHandle(): interop.Pointer | interop.Reference<any>;

	startSavePointWithNameError(name: string): boolean;

	stringFromDate(date: Date): string;

	tableExists(tableName: string): boolean;

	userVersion(): number;

	validateSQLError(sql: string): boolean;
}

declare class FMDatabasePool extends NSObject {

	static alloc(): FMDatabasePool; // inherited from NSObject

	static databaseClass(): typeof NSObject;

	static databasePoolWithPath(aPath: string): FMDatabasePool;

	static databasePoolWithPathFlags(aPath: string, openFlags: number): FMDatabasePool;

	static new(): FMDatabasePool; // inherited from NSObject

	delegate: any;

	maximumNumberOfDatabasesToCreate: number;

	readonly openFlags: number;

	path: string;

	vfsName: string;

	constructor(o: { path: string; });

	constructor(o: { path: string; flags: number; });

	constructor(o: { path: string; flags: number; vfs: string; });

	countOfCheckedInDatabases(): number;

	countOfCheckedOutDatabases(): number;

	countOfOpenDatabases(): number;

	inDatabase(block: (p1: FMDatabase) => void): void;

	inDeferredTransaction(block: (p1: FMDatabase, p2: interop.Pointer | interop.Reference<boolean>) => void): void;

	inSavePoint(block: (p1: FMDatabase, p2: interop.Pointer | interop.Reference<boolean>) => void): NSError;

	inTransaction(block: (p1: FMDatabase, p2: interop.Pointer | interop.Reference<boolean>) => void): void;

	initWithPath(aPath: string): this;

	initWithPathFlags(aPath: string, openFlags: number): this;

	initWithPathFlagsVfs(aPath: string, openFlags: number, vfsName: string): this;

	releaseAllDatabases(): void;
}

declare class FMDatabaseQueue extends NSObject {

	static alloc(): FMDatabaseQueue; // inherited from NSObject

	static databaseClass(): typeof NSObject;

	static databaseQueueWithPath(aPath: string): FMDatabaseQueue;

	static databaseQueueWithPathFlags(aPath: string, openFlags: number): FMDatabaseQueue;

	static new(): FMDatabaseQueue; // inherited from NSObject

	readonly openFlags: number;

	path: string;

	vfsName: string;

	constructor(o: { path: string; });

	constructor(o: { path: string; flags: number; });

	constructor(o: { path: string; flags: number; vfs: string; });

	close(): void;

	inDatabase(block: (p1: FMDatabase) => void): void;

	inDeferredTransaction(block: (p1: FMDatabase, p2: interop.Pointer | interop.Reference<boolean>) => void): void;

	inSavePoint(block: (p1: FMDatabase, p2: interop.Pointer | interop.Reference<boolean>) => void): NSError;

	inTransaction(block: (p1: FMDatabase, p2: interop.Pointer | interop.Reference<boolean>) => void): void;

	initWithPath(aPath: string): this;

	initWithPathFlags(aPath: string, openFlags: number): this;

	initWithPathFlagsVfs(aPath: string, openFlags: number, vfsName: string): this;

	interrupt(): void;
}

declare class FMResultSet extends NSObject {

	static alloc(): FMResultSet; // inherited from NSObject

	static new(): FMResultSet; // inherited from NSObject

	static resultSetWithStatementUsingParentDatabase(statement: FMStatement, aDB: FMDatabase): FMResultSet;

	readonly columnNameToIndexMap: NSMutableDictionary<any, any>;

	query: string;

	statement: FMStatement;
	[index: number]: any;

	UTF8StringForColumnIndex(columnIdx: number): string;

	UTF8StringForColumnName(columnName: string): string;

	boolForColumn(columnName: string): boolean;

	boolForColumnIndex(columnIdx: number): boolean;

	close(): void;

	columnCount(): number;

	columnIndexForName(columnName: string): number;

	columnIndexIsNull(columnIdx: number): boolean;

	columnIsNull(columnName: string): boolean;

	columnNameForIndex(columnIdx: number): string;

	dataForColumn(columnName: string): NSData;

	dataForColumnIndex(columnIdx: number): NSData;

	dataNoCopyForColumn(columnName: string): NSData;

	dataNoCopyForColumnIndex(columnIdx: number): NSData;

	dateForColumn(columnName: string): Date;

	dateForColumnIndex(columnIdx: number): Date;

	doubleForColumn(columnName: string): number;

	doubleForColumnIndex(columnIdx: number): number;

	hasAnotherRow(): boolean;

	intForColumn(columnName: string): number;

	intForColumnIndex(columnIdx: number): number;

	kvcMagic(object: any): void;

	longForColumn(columnName: string): number;

	longForColumnIndex(columnIdx: number): number;

	longLongIntForColumn(columnName: string): number;

	longLongIntForColumnIndex(columnIdx: number): number;

	next(): boolean;

	nextWithError(): boolean;

	objectAtIndexedSubscript(columnIdx: number): any;

	objectForColumnIndex(columnIdx: number): any;

	objectForColumnName(columnName: string): any;

	objectForKeyedSubscript(columnName: string): any;

	resultDict(): NSDictionary<any, any>;

	resultDictionary(): NSDictionary<any, any>;

	setParentDB(newDb: FMDatabase): void;

	stringForColumn(columnName: string): string;

	stringForColumnIndex(columnIdx: number): string;

	unsignedLongLongIntForColumn(columnName: string): number;

	unsignedLongLongIntForColumnIndex(columnIdx: number): number;
}

declare class FMStatement extends NSObject {

	static alloc(): FMStatement; // inherited from NSObject

	static new(): FMStatement; // inherited from NSObject

	inUse: boolean;

	query: string;

	statement: interop.Pointer | interop.Reference<any>;

	useCount: number;

	close(): void;

	reset(): void;
}

interface MAHUncaughtExceptionLogger {
	setEnabled: interop.FunctionReference<(p1: boolean) => void>;
	isEnabled: interop.FunctionReference<() => boolean>;
}
declare var MAHUncaughtExceptionLogger: interop.StructType<MAHUncaughtExceptionLogger>;

declare class MAURAbstractLocationProvider extends NSObject {

	static alloc(): MAURAbstractLocationProvider; // inherited from NSObject

	static new(): MAURAbstractLocationProvider; // inherited from NSObject

	delegate: MAURProviderDelegate;

	notify(message: string): void;

	onSwitchMode(mode: MAUROperationalMode): void;

	onTerminate(): void;
}

declare class MAURActivity extends NSObject implements NSCopying {

	static alloc(): MAURActivity; // inherited from NSObject

	static new(): MAURActivity; // inherited from NSObject

	confidence: number;

	type: string;

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;

	toDictionary(): NSDictionary<any, any>;
}

declare class MAURActivityLocationProvider extends MAURAbstractLocationProvider implements MAURLocationProvider {

	static alloc(): MAURActivityLocationProvider; // inherited from NSObject

	static new(): MAURActivityLocationProvider; // inherited from NSObject

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	onConfigureError(config: MAURConfig): boolean;

	onCreate(): void;

	onDestroy(): void;

	onStart(): boolean;

	onStop(): boolean;

	onSwitchMode(mode: MAUROperationalMode): void;

	onTerminate(): void;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;
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

declare class MAURBackgroundSync extends NSObject {

	static alloc(): MAURBackgroundSync; // inherited from NSObject

	static new(): MAURBackgroundSync; // inherited from NSObject

	delegate: MAURBackgroundSyncDelegate;

	cancel(): void;

	status(): string;

	syncWithTemplateWithHttpHeaders(url: string, locationTemplate: any, httpHeaders: NSMutableDictionary<any, any>): void;
}

interface MAURBackgroundSyncDelegate extends NSObjectProtocol {

	backgroundSyncHttpAuthorizationUpdates?(task: MAURBackgroundSync): void;

	backgroundSyncRequestedAbortUpdates?(task: MAURBackgroundSync): void;
}
declare var MAURBackgroundSyncDelegate: {

	prototype: MAURBackgroundSyncDelegate;
};

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

declare class MAURConfigurationContract extends NSObject {

	static alloc(): MAURConfigurationContract; // inherited from NSObject

	static createTableSQL(): string;

	static new(): MAURConfigurationContract; // inherited from NSObject
}

declare class MAURDistanceFilterLocationProvider extends MAURAbstractLocationProvider implements MAURLocationProvider {

	static alloc(): MAURDistanceFilterLocationProvider; // inherited from NSObject

	static new(): MAURDistanceFilterLocationProvider; // inherited from NSObject

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	onConfigureError(config: MAURConfig): boolean;

	onCreate(): void;

	onDestroy(): void;

	onStart(): boolean;

	onStop(): boolean;

	onSwitchMode(mode: MAUROperationalMode): void;

	onTerminate(): void;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;
}

declare class MAURGeolocationOpenHelper extends MAURSQLiteOpenHelper {

	static alloc(): MAURGeolocationOpenHelper; // inherited from NSObject

	static new(): MAURGeolocationOpenHelper; // inherited from NSObject
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

declare class MAURLocationContract extends NSObject {

	static alloc(): MAURLocationContract; // inherited from NSObject

	static createTableSQL(): string;

	static new(): MAURLocationContract; // inherited from NSObject
}

declare class MAURLocationManager extends NSObject implements CLLocationManagerDelegate {

	static alloc(): MAURLocationManager; // inherited from NSObject

	static new(): MAURLocationManager; // inherited from NSObject

	static sharedInstance(): MAURLocationManager;

	delegate: any;

	locationManager: CLLocationManager;

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	activityType(): CLActivityType;

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	desiredAccuracy(): number;

	distanceFilter(): number;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	locationManagerDidChangeAuthorizationStatus(manager: CLLocationManager, status: CLAuthorizationStatus): void;

	locationManagerDidDetermineStateForRegion(manager: CLLocationManager, state: CLRegionState, region: CLRegion): void;

	locationManagerDidEnterRegion(manager: CLLocationManager, region: CLRegion): void;

	locationManagerDidExitRegion(manager: CLLocationManager, region: CLRegion): void;

	locationManagerDidFailWithError(manager: CLLocationManager, error: NSError): void;

	locationManagerDidFinishDeferredUpdatesWithError(manager: CLLocationManager, error: NSError): void;

	locationManagerDidPauseLocationUpdates(manager: CLLocationManager): void;

	locationManagerDidRangeBeaconsInRegion(manager: CLLocationManager, beacons: NSArray<CLBeacon> | CLBeacon[], region: CLBeaconRegion): void;

	locationManagerDidResumeLocationUpdates(manager: CLLocationManager): void;

	locationManagerDidStartMonitoringForRegion(manager: CLLocationManager, region: CLRegion): void;

	locationManagerDidUpdateHeading(manager: CLLocationManager, newHeading: CLHeading): void;

	locationManagerDidUpdateLocations(manager: CLLocationManager, locations: NSArray<CLLocation> | CLLocation[]): void;

	locationManagerDidUpdateToLocationFromLocation(manager: CLLocationManager, newLocation: CLLocation, oldLocation: CLLocation): void;

	locationManagerDidVisit(manager: CLLocationManager, visit: CLVisit): void;

	locationManagerMonitoringDidFailForRegionWithError(manager: CLLocationManager, region: CLRegion, error: NSError): void;

	locationManagerRangingBeaconsDidFailForRegionWithError(manager: CLLocationManager, region: CLBeaconRegion, error: NSError): void;

	locationManagerShouldDisplayHeadingCalibration(manager: CLLocationManager): boolean;

	monitoredRegions(): NSSet<CLRegion>;

	pausesLocationUpdatesAutomatically(): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	setActivityType(newActivityType: CLActivityType): void;

	setDesiredAccuracy(newDesiredAccuracy: number): void;

	setDistanceFilter(newDistanceFiler: number): void;

	setPausesLocationUpdatesAutomatically(newPausesLocationsUpdatesAutomatically: boolean): void;

	setShowsBackgroundLocationIndicator(shows: boolean): void;

	start(): boolean;

	startMonitoringForRegion(region: CLRegion): void;

	startMonitoringSignificantLocationChanges(): boolean;

	stop(): boolean;

	stopMonitoringAllRegions(): void;

	stopMonitoringForRegion(region: CLRegion): void;

	stopMonitoringForRegionIdentifier(identifier: string): void;

	stopMonitoringSignificantLocationChanges(): boolean;
}

interface MAURLocationManagerDelegate {

	onAuthorizationChanged(authStatus: MAURLocationAuthorizationStatus): void;

	onError(error: NSError): void;

	onLocationPause(manager: CLLocationManager): void;

	onLocationResume(manager: CLLocationManager): void;

	onLocationsChanged(locations: NSArray<any> | any[]): void;

	onRegionExit(region: CLRegion): void;
}
declare var MAURLocationManagerDelegate: {

	prototype: MAURLocationManagerDelegate;
};

interface MAURLocationProvider extends NSObjectProtocol {

	onConfigureError(config: MAURConfig): boolean;

	onCreate(): void;

	onDestroy(): void;

	onStart(): boolean;

	onStop(): boolean;

	onSwitchMode(mode: MAUROperationalMode): void;

	onTerminate(): void;
}
declare var MAURLocationProvider: {

	prototype: MAURLocationProvider;
};

declare const enum MAURLocationStatus {

	Deleted = 0,

	PostPending = 1,

	SyncPending = 2
}

declare class MAURLogReader extends NSObject {

	static alloc(): MAURLogReader; // inherited from NSObject

	static new(): MAURLogReader; // inherited from NSObject

	constructor(o: { logDirectory: string; });

	getEntriesFromLogEntryIdMinLogLevel(limit: number, entryId: number, minLogLevel: DDLogFlag): NSArray<any>;

	getLogEntriesFromLogEntryIdMinLogLevelAsString(limit: number, offset: number, minLogLevel: string): NSArray<any>;

	initWithLogDirectory(aLogDirectory: string): this;

	prepareSQLFromLogEntryIdMinLogLevel(limit: number, entryId: number, minLogLevel: number): string;
}

declare const enum MAUROperationalMode {

	BackgroundMode = 0,

	ForegroundMode = 1
}

declare class MAURPostLocationTask extends NSObject {

	static alloc(): MAURPostLocationTask; // inherited from NSObject

	static locationTransform(): (p1: MAURLocation) => MAURLocation;

	static new(): MAURPostLocationTask; // inherited from NSObject

	static setLocationTransform(transform: (p1: MAURLocation) => MAURLocation): void;

	config: MAURConfig;

	delegate: MAURPostLocationTaskDelegate;

	add(location: MAURLocation): void;

	start(): void;

	stop(): void;

	sync(): void;
}

interface MAURPostLocationTaskDelegate extends NSObjectProtocol {

	postLocationTaskHttpAuthorizationUpdates?(task: MAURPostLocationTask): void;

	postLocationTaskRequestedAbortUpdates?(task: MAURPostLocationTask): void;
}
declare var MAURPostLocationTaskDelegate: {

	prototype: MAURPostLocationTaskDelegate;
};

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

declare class MAURRawLocationProvider extends MAURAbstractLocationProvider implements MAURLocationProvider {

	static alloc(): MAURRawLocationProvider; // inherited from NSObject

	static new(): MAURRawLocationProvider; // inherited from NSObject

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	onConfigureError(config: MAURConfig): boolean;

	onCreate(): void;

	onDestroy(): void;

	onStart(): boolean;

	onStop(): boolean;

	onSwitchMode(mode: MAUROperationalMode): void;

	onTerminate(): void;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;
}

declare class MAURSQLiteConfigurationDAO extends NSObject {

	static alloc(): MAURSQLiteConfigurationDAO; // inherited from NSObject

	static new(): MAURSQLiteConfigurationDAO; // inherited from NSObject

	static sharedInstance(): MAURSQLiteConfigurationDAO;

	clearDatabase(): boolean;

	getDatabaseName(): string;

	getDatabasePath(): string;

	persistConfiguration(config: MAURConfig): boolean;

	retrieveConfiguration(): MAURConfig;
}

declare class MAURSQLiteHelper extends NSObject {

	static alloc(): MAURSQLiteHelper; // inherited from NSObject

	static createTableSqlStatementColumns(tableName: string, columns: NSArray<NSDictionary<string, SQLColumnType>> | NSDictionary<string, SQLColumnType>[]): string;

	static new(): MAURSQLiteHelper; // inherited from NSObject
}

declare class MAURSQLiteLocationDAO extends NSObject {

	static alloc(): MAURSQLiteLocationDAO; // inherited from NSObject

	static new(): MAURSQLiteLocationDAO; // inherited from NSObject

	static sharedInstance(): MAURSQLiteLocationDAO;

	clearDatabase(): boolean;

	deleteAllLocations(): boolean;

	deleteLocationError(locationId: number): boolean;

	getAllLocations(): NSArray<MAURLocation>;

	getDatabaseName(): string;

	getDatabasePath(): string;

	getLocationsForSync(): NSArray<MAURLocation>;

	getLocationsForSyncCount(): number;

	getValidLocations(): NSArray<MAURLocation>;

	persistLocation(location: MAURLocation): number;

	persistLocationLimitRows(location: MAURLocation, maxRows: number): number;
}

declare class MAURSQLiteOpenHelper extends NSObject {

	static alloc(): MAURSQLiteOpenHelper; // inherited from NSObject

	static new(): MAURSQLiteOpenHelper; // inherited from NSObject

	constructor(o: { version: string; });

	close(): void;

	getDatabaseMetadata(): NSDictionary<any, any>;

	getDatabaseName(): string;

	getDatabasePath(): string;

	getReadableDatabase(): FMDatabaseQueue;

	getWritableDatabase(): FMDatabaseQueue;

	initVersion(name: string, version: number): this;
}

declare const enum NetworkStatus {

	NotReachable = 0,

	ReachableViaWiFi = 2,

	ReachableViaWWAN = 1
}

declare const RAW_PROVIDER: number;

declare class Reachability extends NSObject {

	static alloc(): Reachability; // inherited from NSObject

	static new(): Reachability; // inherited from NSObject

	static reachabilityForInternetConnection(): Reachability;

	static reachabilityForLocalWiFi(): Reachability;

	static reachabilityWithAddress(hostAddress: interop.Pointer | interop.Reference<any>): Reachability;

	static reachabilityWithHostName(hostname: string): Reachability;

	static reachabilityWithHostname(hostname: string): Reachability;

	reachabilityBlock: (p1: Reachability, p2: number) => void;

	reachableBlock: (p1: Reachability) => void;

	reachableOnWWAN: boolean;

	unreachableBlock: (p1: Reachability) => void;

	constructor(o: { reachabilityRef: any; });

	connectionRequired(): boolean;

	currentReachabilityFlags(): string;

	currentReachabilityStatus(): NetworkStatus;

	currentReachabilityString(): string;

	initWithReachabilityRef(ref: any): this;

	isConnectionOnDemand(): boolean;

	isConnectionRequired(): boolean;

	isInterventionRequired(): boolean;

	isReachable(): boolean;

	isReachableViaWWAN(): boolean;

	isReachableViaWiFi(): boolean;

	reachabilityFlags(): SCNetworkReachabilityFlags;

	startNotifier(): boolean;

	stopNotifier(): void;
}

declare var ReachabilityVersionNumber: number;

declare var ReachabilityVersionString: interop.Reference<number>;

declare class SQLColumnType extends NSObject {

	static alloc(): SQLColumnType; // inherited from NSObject

	static new(): SQLColumnType; // inherited from NSObject

	static sqlColumnWithType(type: SQLType): SQLColumnType;

	type: SQLType;

	asString(): string;
}

declare class SQLPrimaryKeyAutoIncColumnType extends SQLColumnType {

	static alloc(): SQLPrimaryKeyAutoIncColumnType; // inherited from NSObject

	static new(): SQLPrimaryKeyAutoIncColumnType; // inherited from NSObject
}

declare class SQLPrimaryKeyColumnType extends SQLColumnType {

	static alloc(): SQLPrimaryKeyColumnType; // inherited from NSObject

	static new(): SQLPrimaryKeyColumnType; // inherited from NSObject
}

declare const enum SQLType {

	kReal = 0,

	kInteger = 1,

	kText = 2,

	kDateTime = 3
}

declare var ddLogLevel: DDLogLevel;

declare var kDDASLDDLogValue: string;

declare var kDDASLKeyDDLog: string;

declare var kDDDefaultLogFilesDiskQuota: number;

declare var kDDDefaultLogMaxFileSize: number;

declare var kDDDefaultLogMaxNumLogFiles: number;

declare var kDDDefaultLogRollingFrequency: number;

declare var kReachabilityChangedNotification: string;

declare function mah_get_uncaught_exception_logger(): interop.Pointer | interop.Reference<MAHUncaughtExceptionLogger>;
