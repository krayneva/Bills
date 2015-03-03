//
//  CustomCameraViewController.h
//  CustomCamera
//
//  Created by Chris van Es on 24/02/2014.
//
//

#import <UIKit/UIKit.h>
extern CGFloat leftMargin;
extern CGFloat topMargin;
extern CGFloat bottomMargin;
extern UITextView *_photoCountTextView;
extern UIButton *_recaptureButton;
extern UIButton *_sendButton;
extern UIButton *_captureButton;
extern UIImageView *_previousPhoto;
extern CGFloat buttonHeight;
extern CGFloat buttonWidth;

@interface CustomCameraViewController : UIViewController

- (id)initWithCallback:(void(^)(UIImage*))callback callbackSend:callbackSend callbackRecapture:callbackRecapture;

@end
