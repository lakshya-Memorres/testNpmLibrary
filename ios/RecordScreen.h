
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNRecordScreenSpec.h"

@interface RecordScreen : NSObject <NativeRecordScreenSpec>
#else
#import <React/RCTBridgeModule.h>

@interface RecordScreen : NSObject <RCTBridgeModule>
#endif

@end
