//
//  CustomCamera.m
//  CustomCamera
//
//  Created by Chris van Es on 24/02/2014.
//
//

#import "CustomCamera.h"
#import "CustomCameraViewController.h"
#import "CDVCamera.h"
#import "CDVJpegHeaderWriter.h"
#import <Cordova/NSArray+Comparisons.h>
#import <Cordova/NSData+Base64.h>
#import <Cordova/NSDictionary+Extensions.h>
#import <ImageIO/CGImageProperties.h>
#import <AssetsLibrary/ALAssetRepresentation.h>
#import <AssetsLibrary/AssetsLibrary.h>
#import <ImageIO/CGImageSource.h>
#import <ImageIO/CGImageProperties.h>
#import <ImageIO/CGImageDestination.h>
#import <MobileCoreServices/UTCoreTypes.h>
#import "CDVJpegHeaderWriter.h"
#include "CDVExif.h"

#import "CDVCamera.h"
#import "CDVJpegHeaderWriter.h"
#import <Cordova/NSArray+Comparisons.h>
#import <Cordova/NSData+Base64.h>
#import <Cordova/NSDictionary+Extensions.h>
#import <ImageIO/CGImageProperties.h>
#import <AssetsLibrary/ALAssetRepresentation.h>
#import <AssetsLibrary/AssetsLibrary.h>
#import <ImageIO/CGImageSource.h>
#import <ImageIO/CGImageProperties.h>
#import <ImageIO/CGImageDestination.h>
#import <MobileCoreServices/UTCoreTypes.h>

#import <AddressBook/AddressBook.h>
#import <AddressBookUI/AddressBookUI.h>
@implementation CustomCamera

@synthesize locationManager;
NSMutableDictionary *GPSDictionary;
NSString *path;
NSString *finalImagePath;
NSMutableArray *imagePaths;
CLLocationDegrees latitude=-1,longitude=-1;

- (void)takePicture:(CDVInvokedUrlCommand*)command {
    NSString *filename = [command argumentAtIndex:0];
    CGFloat quality = [[command argumentAtIndex:1] floatValue];
    CGFloat targetWidth = [[command argumentAtIndex:2] floatValue];
    CGFloat targetHeight = [[command argumentAtIndex:3] floatValue];
     NSMutableString *documentsDirectory = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    
    NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
    [formatter setDateFormat:@"dd-MM-yyyy HH:mm:ss" ];
    NSString *dateString = [formatter stringFromDate: [NSDate date]];
    finalImagePath = [[documentsDirectory stringByAppendingPathComponent:filename] stringByAppendingString:dateString];
    
  
    GPSDictionary = nil;
     imagePaths = [[NSMutableArray alloc] init];
    [[self locationManager] startUpdatingLocation];
    
    printf("\n");
    printf(" targetWidth=");
    printf("%f",targetWidth);
    
    printf("\n");
    printf(" targetHeight=");
    printf("%f", targetHeight);
    

    
    if (![UIImagePickerController isCameraDeviceAvailable:UIImagePickerControllerCameraDeviceRear]) {
        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"No rear camera detected"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    } else if (![UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypeCamera]) {
        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Camera is not accessible"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    } else {
    
    


    
        CustomCameraViewController *cameraViewController = [[CustomCameraViewController alloc] initWithCallback:^(UIImage *image) {
            
           
           
            UIImage *scaledImage = [self scaleImage:image toSize:CGSizeMake(targetWidth, targetHeight)];
            NSData *scaledImageData = UIImageJPEGRepresentation(scaledImage, quality / 100);
        //      NSData *scaledImageData = UIImageJPEGRepresentation(scaledImage,1);
             NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
            [formatter setDateFormat:@"dd-MM-yyyy HH:mm:ss" ];
            NSString *dateString = [formatter stringFromDate: [NSDate date]];
            NSString *imagePath=[finalImagePath stringByAppendingString:dateString];
            
            
            self.data = scaledImageData;
            self.metadata = [[NSMutableDictionary alloc] init];
            if (GPSDictionary!=nil)
             [self.metadata setObject:GPSDictionary forKey:(NSString *)kCGImagePropertyGPSDictionary];

            scaledImageData = self.data;
             if (self.metadata) {
                CGImageSourceRef sourceImage = CGImageSourceCreateWithData((__bridge_retained CFDataRef)scaledImageData, NULL);
                CFStringRef sourceType = CGImageSourceGetType(sourceImage);
                
                CGImageDestinationRef destinationImage = CGImageDestinationCreateWithData((__bridge CFMutableDataRef)scaledImageData, sourceType, 1, NULL);
                CGImageDestinationAddImageFromSource(destinationImage, sourceImage, 0, (__bridge CFDictionaryRef)self.metadata);
                CGImageDestinationFinalize(destinationImage);
                
                CFRelease(sourceImage);
                CFRelease(destinationImage);
            }
            else{
                printf("\n");
                 printf("NO METADATA!");
            }
             NSError* err = nil;
            printf("saving image!");
            
          //  [scaledImageData writeToFile:imagePath options:NSAtomicWrite];
            [scaledImageData writeToFile:imagePath  options:NSAtomicWrite  error:&err];
            [imagePaths addObject:imagePath];
            [self updateUI];
           
        }
           callbackSend:^(){
               [self combineImages];
               
               NSString *res=@"{\"ImageUri\":\"";
              res = [res stringByAppendingString:[[NSURL fileURLWithPath:finalImagePath] absoluteString]];
               res = [res stringByAppendingString:@"\",\"Latitude\":\""];
               res = [res stringByAppendingString:[[NSString alloc] initWithFormat:@"%f", latitude]];
               res = [res stringByAppendingString:@"\",\"Longitude\":\""];
                res = [res stringByAppendingString:[[NSString alloc] initWithFormat:@"%f", longitude]];
               res = [res stringByAppendingString:@"\"}"];
                NSLog(@"--------------");
               NSLog(res);
               CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                      messageAsString:res];
               [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                [self.viewController dismissViewControllerAnimated:YES completion:nil];
               
              
           }
          callbackRecapture:^(){
              [imagePaths removeLastObject];
              [self updateUI];
          }
                                                            

         ];

        [self.viewController presentViewController:cameraViewController animated:YES completion:nil];

    }
    [self updateUI];
}

-(void) updateUI{
    CGRect bounds = [[UIScreen mainScreen] bounds];
    if (imagePaths.count>0){
        
        
        [_photoCountTextView setText:@"Продолжение чека"];
        _previousPhoto.frame=CGRectMake(leftMargin,
                                        0,
                                        bounds.size.width-leftMargin*2,
                                        topMargin);
        
        
        UIImage *lastImage = [UIImage imageWithContentsOfFile:[imagePaths lastObject]];
        CGRect rect = CGRectMake(0,lastImage.size.height-topMargin, lastImage.size.width, topMargin);
        
        // Create bitmap image from original image data,
        // using rectangle to specify desired crop area
        CGImageRef imageRef = CGImageCreateWithImageInRect([lastImage CGImage], rect);
        UIImage *img = [UIImage imageWithCGImage:imageRef];
        CGImageRelease(imageRef);
        [_previousPhoto initWithImage:img];
        _sendButton.frame=CGRectMake(CGRectGetMaxX(_captureButton.frame) +leftMargin,
                                     CGRectGetMinY(_captureButton.frame) ,
                                     buttonWidth,
                                     buttonHeight
                                     );
        _recaptureButton.frame = CGRectMake(CGRectGetMaxX(_sendButton.frame) +leftMargin,
                                            CGRectGetMinY(_sendButton.frame) ,
                                            buttonWidth,
                                            buttonHeight
                                            );
    }
    else{
        _recaptureButton.frame = CGRectMake(0,0,0,0);
        [_photoCountTextView setText:@"Фото чека"];
        _previousPhoto.frame=CGRectMake(0,0,0,0);
        _sendButton.frame=CGRectMake(0,0,0,0);
    }
        
}


- (UIImage*)scaleImage:(UIImage*)image toSize:(CGSize)targetSize {
     CGRect bounds = [[UIScreen mainScreen] bounds];
    
     image = [self fixrotation:image];
    
    CGFloat scaleHor = image.size.width/bounds.size.width;
    CGFloat scaleVer = image.size.height/bounds.size.height;
    scaleHor = scaleVer;


    
    CGFloat impWidth = (bounds.size.width-leftMargin*2)*scaleHor;
    CGFloat leftMarginCorrected =(image.size.width-impWidth)/2;
    
   /* CGRect rect = CGRectMake(leftMargin*scaleHor,topMargin*scaleVer, (image.size.width-(2*leftMargin*scaleHor)), (image.size.height-(topMargin*scaleVer)-(bottomMargin*scaleVer)));*/
    CGRect rect = CGRectMake(leftMarginCorrected,topMargin*scaleVer, impWidth, (image.size.height-(topMargin*scaleVer)-(bottomMargin*scaleVer)));
    
    // Create bitmap image from original image data,
    // using rectangle to specify desired crop area
    CGImageRef imageRef = CGImageCreateWithImageInRect([image CGImage], rect);
    UIImage *img = [UIImage imageWithCGImage:imageRef];
    CGImageRelease(imageRef);
    
    printf("\n");
    printf(" cropped image width=");
    printf("%f",img.size.width);
    printf("\n");
    printf(" cropped image height=");
    printf("%f",img.size.height);
    return img;
    
   /* if (targetSize.width <= 0) {
        return img;
    }
    
    CGFloat aspectRatio = img.size.height / img.size.width;
    CGSize scaledSize;
    if (targetSize.width > 0) {
        scaledSize = CGSizeMake(targetSize.width, targetSize.width * aspectRatio);
    }
    
    

    UIGraphicsBeginImageContext(scaledSize);

    [image drawInRect:CGRectMake(0, 0, scaledSize.width, scaledSize.height)];
    UIImage *scaledImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return scaledImage;*/
}



- (UIImage *)fixrotation:(UIImage *)image{
    
   
    
    if (image.imageOrientation == UIImageOrientationUp) {
        printf("\n");
        printf(" image rotation is ok, width=");
        printf("%f",image.size.width);
        printf("  height=");
        printf("%f",image.size.height);
        return image;
    }
    printf("\n");
    printf(" image rotated");
       printf("\n");
    
    /* UIAlertView *errorAlert = [[UIAlertView alloc]initWithTitle:@"image width before rotation"
                                           message:[NSString stringWithFormat:@"%f", image.size.width] delegate:nil cancelButtonTitle:@"ok" otherButtonTitles:nil];
    [errorAlert show];
    
    errorAlert = [[UIAlertView alloc]initWithTitle:@"image height before rotation"
                                           message:[NSString stringWithFormat:@"%f", image.size.height] delegate:nil cancelButtonTitle:@"ok" otherButtonTitles:nil];
    [errorAlert show];
    
    
    [errorAlert show];*/
    CGAffineTransform transform = CGAffineTransformIdentity;
    
    switch (image.imageOrientation) {
        case UIImageOrientationDown:
        case UIImageOrientationDownMirrored:
            transform = CGAffineTransformTranslate(transform, image.size.width, image.size.height);
            transform = CGAffineTransformRotate(transform, M_PI);
            break;
            
        case UIImageOrientationLeft:
        case UIImageOrientationLeftMirrored:
            transform = CGAffineTransformTranslate(transform, image.size.width, 0);
            transform = CGAffineTransformRotate(transform, M_PI_2);
            break;
            
        case UIImageOrientationRight:
        case UIImageOrientationRightMirrored:
            transform = CGAffineTransformTranslate(transform, 0, image.size.height);
            transform = CGAffineTransformRotate(transform, -M_PI_2);
            break;
        case UIImageOrientationUp:
        case UIImageOrientationUpMirrored:
            break;
    }
    
    switch (image.imageOrientation) {
        case UIImageOrientationUpMirrored:
        case UIImageOrientationDownMirrored:
            transform = CGAffineTransformTranslate(transform, image.size.width, 0);
            transform = CGAffineTransformScale(transform, -1, 1);
            break;
            
        case UIImageOrientationLeftMirrored:
        case UIImageOrientationRightMirrored:
            transform = CGAffineTransformTranslate(transform, image.size.height, 0);
            transform = CGAffineTransformScale(transform, -1, 1);
            break;
        case UIImageOrientationUp:
        case UIImageOrientationDown:
        case UIImageOrientationLeft:
        case UIImageOrientationRight:
            break;
    }
    
    // Now we draw the underlying CGImage into a new context, applying the transform
    // calculated above.
    CGContextRef ctx = CGBitmapContextCreate(NULL, image.size.width, image.size.height,
                                             CGImageGetBitsPerComponent(image.CGImage), 0,
                                             CGImageGetColorSpace(image.CGImage),
                                             CGImageGetBitmapInfo(image.CGImage));
    CGContextConcatCTM(ctx, transform);
    switch (image.imageOrientation) {
        case UIImageOrientationLeft:
        case UIImageOrientationLeftMirrored:
        case UIImageOrientationRight:
        case UIImageOrientationRightMirrored:
            // Grr...
            CGContextDrawImage(ctx, CGRectMake(0,0,image.size.height,image.size.width), image.CGImage);
            break;
            
        default:
            CGContextDrawImage(ctx, CGRectMake(0,0,image.size.width,image.size.height), image.CGImage);
            break;
    }
    
    // And now we just create a new UIImage from the drawing context
    CGImageRef cgimg = CGBitmapContextCreateImage(ctx);
    UIImage *img = [UIImage imageWithCGImage:cgimg];
    CGContextRelease(ctx);
    CGImageRelease(cgimg);
    return img;}





-(CLLocationManager *)locationManager {
   
	if (locationManager != nil) {
		return locationManager;
	}
    
	locationManager = [[CLLocationManager alloc] init];
	[locationManager setDesiredAccuracy:kCLLocationAccuracyNearestTenMeters];
	[locationManager setDelegate:self];
  
    
	return locationManager;
}

- (void)locationManager:(CLLocationManager*)manager didUpdateToLocation:(CLLocation*)newLocation fromLocation:(CLLocation*)oldLocation
{
	if (locationManager != nil) {
		[self.locationManager stopUpdatingLocation];
		self.locationManager = nil;
        
		GPSDictionary = [[NSMutableDictionary dictionary] init];
        
		latitude  = newLocation.coordinate.latitude;
		CLLocationDegrees longitude = newLocation.coordinate.longitude;
        printf("LATITUDE");
        printf("%f",newLocation.coordinate.latitude);
        printf("\n");
        printf("LONGITUDE");
        printf("%f",newLocation.coordinate.longitude);
        printf("\n");
       // printf(" top margin=");
        
		// latitude
		if (latitude < 0.0) {
			latitude = latitude * -1.0f;
			[GPSDictionary setObject:@"S" forKey:(NSString*)kCGImagePropertyGPSLatitudeRef];
		} else {
			[GPSDictionary setObject:@"N" forKey:(NSString*)kCGImagePropertyGPSLatitudeRef];
		}
		[GPSDictionary setObject:[NSNumber numberWithFloat:latitude] forKey:(NSString*)kCGImagePropertyGPSLatitude];
        
		// longitude
		if (longitude < 0.0) {
			longitude = longitude * -1.0f;
			[GPSDictionary setObject:@"W" forKey:(NSString*)kCGImagePropertyGPSLongitudeRef];
		}
		else {
			[GPSDictionary setObject:@"E" forKey:(NSString*)kCGImagePropertyGPSLongitudeRef];
		}
		[GPSDictionary setObject:[NSNumber numberWithFloat:longitude] forKey:(NSString*)kCGImagePropertyGPSLongitude];
        
		// altitude
        CGFloat altitude = newLocation.altitude;
        if (!isnan(altitude)){
			if (altitude < 0) {
				altitude = -altitude;
				[GPSDictionary setObject:@"1" forKey:(NSString *)kCGImagePropertyGPSAltitudeRef];
			} else {
				[GPSDictionary setObject:@"0" forKey:(NSString *)kCGImagePropertyGPSAltitudeRef];
			}
			[GPSDictionary setObject:[NSNumber numberWithFloat:altitude] forKey:(NSString *)kCGImagePropertyGPSAltitude];
        }
        
        // Time and date
       /* NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
        [formatter setDateFormat:@"HH:mm:ss.SSSSSS"];
        [formatter setTimeZone:[NSTimeZone timeZoneWithAbbreviation:@"UTC"]];
        [GPSDictionary setObject:[formatter stringFromDate:newLocation.timestamp] forKey:(NSString *)kCGImagePropertyGPSTimeStamp];
        [formatter setDateFormat:@"yyyy:MM:dd"];
        [GPSDictionary setObject:[formatter stringFromDate:newLocation.timestamp] forKey:(NSString *)kCGImagePropertyGPSDateStamp];*/
        //  self.metadata = [[NSMutableDictionary alloc] init];
		[self.metadata setObject:GPSDictionary forKey:(NSString *)kCGImagePropertyGPSDictionary];
 		
	}
    [self imagePickerControllerReturnImageResult];
}



-(void) updateLocation{
    if (locationManager != nil) {
    GPSDictionary = [[NSMutableDictionary dictionary] init];
    
    latitude  = locationManager.location.coordinate.latitude;
    longitude = locationManager.location.coordinate.longitude;
    printf("LATITUDE");
    printf("%f",locationManager.location.coordinate.latitude);
    printf("\n");
    printf("LONGITUDE");
    printf("%f",locationManager.location.coordinate.longitude);
    printf("\n");
    // printf(" top margin=");
    
    // latitude
    if (latitude < 0.0) {
        latitude = latitude * -1.0f;
        [GPSDictionary setObject:@"S" forKey:(NSString*)kCGImagePropertyGPSLatitudeRef];
    } else {
        [GPSDictionary setObject:@"N" forKey:(NSString*)kCGImagePropertyGPSLatitudeRef];
    }
    [GPSDictionary setObject:[NSNumber numberWithFloat:latitude] forKey:(NSString*)kCGImagePropertyGPSLatitude];
    
    // longitude
    if (longitude < 0.0) {
        longitude = longitude * -1.0f;
        [GPSDictionary setObject:@"W" forKey:(NSString*)kCGImagePropertyGPSLongitudeRef];
    }
    else {
        [GPSDictionary setObject:@"E" forKey:(NSString*)kCGImagePropertyGPSLongitudeRef];
    }
    [GPSDictionary setObject:[NSNumber numberWithFloat:longitude] forKey:(NSString*)kCGImagePropertyGPSLongitude];
    
    // altitude
    CGFloat altitude = locationManager.location.altitude;
    if (!isnan(altitude)){
        if (altitude < 0) {
            altitude = -altitude;
            [GPSDictionary setObject:@"1" forKey:(NSString *)kCGImagePropertyGPSAltitudeRef];
        } else {
            [GPSDictionary setObject:@"0" forKey:(NSString *)kCGImagePropertyGPSAltitudeRef];
        }
        [GPSDictionary setObject:[NSNumber numberWithFloat:altitude] forKey:(NSString *)kCGImagePropertyGPSAltitude];
    }
    
    // Time and date
   /* NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
    [formatter setDateFormat:@"HH:mm:ss.SSSSSS"];
    [formatter setTimeZone:[NSTimeZone timeZoneWithAbbreviation:@"UTC"]];
    [GPSDictionary setObject:[formatter stringFromDate:locationManager.location.timestamp] forKey:(NSString *)kCGImagePropertyGPSTimeStamp];
    [formatter setDateFormat:@"yyyy:MM:dd"];
    [GPSDictionary setObject:[formatter stringFromDate:locationManager.location.timestamp] forKey:(NSString *)kCGImagePropertyGPSDateStamp];
    */
    //  self.metadata = [[NSMutableDictionary alloc] init];
    [self.metadata setObject:GPSDictionary forKey:(NSString *)kCGImagePropertyGPSDictionary];
    
    }
    [self imagePickerControllerReturnImageResult];
}

- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error {
	if (locationManager != nil) {
		[self.locationManager stopUpdatingLocation];
		self.locationManager = nil;
        
	//	[self imagePickerControllerReturnImageResult];
	}
}

- (void)imagePickerControllerReturnImageResult
    {
        CDVPluginResult* result = nil;
        
        if (self.metadata) {
            CGImageSourceRef sourceImage = CGImageSourceCreateWithData((__bridge_retained CFDataRef)self.data, NULL);
            CFStringRef sourceType = CGImageSourceGetType(sourceImage);
            
            CGImageDestinationRef destinationImage = CGImageDestinationCreateWithData((__bridge CFMutableDataRef)self.data, sourceType, 1, NULL);
            CGImageDestinationAddImageFromSource(destinationImage, sourceImage, 0, (__bridge CFDictionaryRef)self.metadata);
            CGImageDestinationFinalize(destinationImage);
            
            CFRelease(sourceImage);
            CFRelease(destinationImage);
        }
        
      /*  if (self.pickerController.saveToPhotoAlbum) {
            ALAssetsLibrary *library = [ALAssetsLibrary new];
            [library writeImageDataToSavedPhotosAlbum:self.data metadata:self.metadata completionBlock:nil];
        }
        
        if (self.pickerController.returnType == DestinationTypeFileUri) {
            // write to temp directory and return URI
            // get the temp directory path
            NSString* docsPath = [NSTemporaryDirectory()stringByStandardizingPath];
            NSError* err = nil;
            NSFileManager* fileMgr = [[NSFileManager alloc] init]; // recommended by apple (vs [NSFileManager defaultManager]) to be threadsafe
            // generate unique file name
            NSString* filePath;
            
            int i = 1;
            do {
                filePath = [NSString stringWithFormat:@"%@/%@%03d.%@", docsPath, CDV_PHOTO_PREFIX, i++, self.pickerController.encodingType == EncodingTypePNG ? @"png":@"jpg"];
            } while ([fileMgr fileExistsAtPath:filePath]);
            
            // save file
            if (![self.data writeToFile:filePath options:NSAtomicWrite error:&err]) {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsString:[err localizedDescription]];
            }
            else {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[[NSURL fileURLWithPath:filePath] absoluteString]];
            }
        }
        else {
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[self.data base64EncodedString]];
        }
        if (result) {
            [self.commandDelegate sendPluginResult:result callbackId:self.pickerController.callbackId];
        }
        
        if (result) {
            [self.commandDelegate sendPluginResult:result callbackId:self.pickerController.callbackId];
        }
        
        self.hasPendingOperation = NO;
        self.pickerController = nil;
        self.data = nil;
        self.metadata = nil;*/
    }

- (void)combineImages{
   /* CGRect rect = CGRectMake(leftMarginCorrected,topMargin*scaleVer, impWidth, (image.size.height-(topMargin*scaleVer)-(bottomMargin*scaleVer)));
    
    // Create bitmap image from original image data,
    // using rectangle to specify desired crop area
    CGImageRef imageRef = CGImageCreateWithImageInRect([image CGImage], rect);
    UIImage *img = [UIImage imageWithCGImage:imageRef];
    CGImageRelease(imageRef);*/
    
   
    UIImage *firstImage = [UIImage imageWithContentsOfFile:[imagePaths firstObject]];
    
    CGSize imageSize=firstImage.size;
    CGSize finalSize = CGSizeMake(imageSize.width, imageSize.height*[imagePaths count]);
    UIGraphicsBeginImageContext(finalSize);
    for (NSString  *path in imagePaths){
        UIImage *image = [UIImage imageWithContentsOfFile:path];
        [image drawInRect:CGRectMake(0,imageSize.height*[imagePaths indexOfObject:path], imageSize.width,imageSize.height)];
        
    }
    UIImage *finalImage=UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    NSData *finalImageData = UIImageJPEGRepresentation(finalImage, 1);
    NSError* err = nil;
    
    [finalImageData writeToFile:finalImagePath  options:NSAtomicWrite error:&err];
}



@end