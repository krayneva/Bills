//
//  CustomCameraViewController.m
//  CustomCamera
//
//  Created by Chris van Es on 24/02/2014.
//
//

#import "CustomCameraViewController.h"

#import <Cordova/CDV.h>
#import <AVFoundation/AVFoundation.h>

@implementation CustomCameraViewController {
    void(^_callback)(UIImage*);
    void(^_callbackSend)();
    void(^_callbackRecapture)();
    AVCaptureSession *_captureSession;
    AVCaptureDevice *_rearCamera;
    AVCaptureStillImageOutput *_stillImageOutput;
    UIView *_buttonPanel;

    UIButton *_backButton;
    

    UIImageView *_topLeftGuide;
    UIImageView *_topRightGuide;
    UIImageView *_bottomLeftGuide;
    UIImageView *_bottomRightGuide;

    UIActivityIndicatorView *_activityIndicator;
    
    
    UIView *_leftPanel;
    UIView *_rightPanel;
    UIView *_topPanel;
    UIView *_bottomPanel;


}

static const CGFloat kBigButtonWidthPhone = 64;
static const CGFloat kBigButtonHeightPhone = 64;

static const CGFloat kBorderImageWidthPhone = 50;
static const CGFloat kBorderImageHeightPhone = 50;
static const CGFloat kHorizontalInsetPhone = 15;
static const CGFloat kVerticalInsetPhone = 25;
static const CGFloat kBigButtonVerticalInsetPhone = 10;

static const CGFloat kBigButtonWidthTablet = 75;
static const CGFloat kBigButtonHeightTablet = 75;

static const CGFloat kBorderImageWidthTablet = 50;
static const CGFloat kBorderImageHeightTablet = 50;
static const CGFloat kHorizontalInsetTablet = 100;
static const CGFloat kVerticalInsetTablet = 50;
static const CGFloat kBigButtonVerticalInsetTablet = 20;

//static const CGFloat kAspectRatio = 125.0f / 86;

CGFloat topMargin=0;
CGFloat leftMargin=0;
CGFloat bottomMargin=0;
CGFloat buttonWidth=0;
CGFloat buttonHeight=0;
UITextView *_photoCountTextView;
UIImageView *_previousPhoto;
UIButton *_recaptureButton;
UIButton *_sendButton;
UIButton *_captureButton;

- (id)initWithCallback:(void(^)(UIImage*))callback callbackSend:callbackSend callbackRecapture:callbackRecapture{
    self = [super initWithNibName:nil bundle:nil];
    if (self) {
        _callback = callback;
        _callbackSend = callbackSend;
        _callbackRecapture=callbackRecapture;
        _captureSession = [[AVCaptureSession alloc] init];
        _captureSession.sessionPreset = AVCaptureSessionPresetPhoto;
    }
    return self;
}

- (void)dealloc {
    [_captureSession stopRunning];
}

- (void)loadView {
    self.view = [[UIView alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.view.backgroundColor = [UIColor whiteColor];
    AVCaptureVideoPreviewLayer *previewLayer = [AVCaptureVideoPreviewLayer layerWithSession:_captureSession];
    previewLayer.videoGravity = AVLayerVideoGravityResizeAspectFill;
    previewLayer.frame = self.view.bounds;
    [[self.view layer] addSublayer:previewLayer];
    [self.view addSubview:[self createOverlay]];
    _activityIndicator = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
    _activityIndicator.center = self.view.center;
    [self.view addSubview:_activityIndicator];
    [_activityIndicator startAnimating];
}

- (UIView*)createOverlay {
    UIView *overlay = [[UIView alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    
    _buttonPanel = [[UIView alloc] initWithFrame:CGRectZero];
    [_buttonPanel setBackgroundColor:[UIColor colorWithWhite:0 alpha:0.75f]];
    [overlay addSubview:_buttonPanel];
    
    _captureButton = [UIButton buttonWithType:UIButtonTypeCustom];
    //[_captureButton setImage:[UIImage imageNamed:@"www/img/cameraoverlay/capture_button.png"] forState:UIControlStateNormal];
    //[_captureButton setImage:[UIImage imageNamed:@"www/img/cameraoverlay/capture_button_pressed.png"] forState:UIControlStateSelected];
   // [_captureButton setImage:[UIImage imageNamed:@"www/img/cameraoverlay/capture_button_pressed.png"] forState:UIControlStateHighlighted];
    
    
    [_captureButton setImage:[UIImage imageNamed:@"www/img/cameraoverlay/camera393.png"] forState:UIControlStateNormal];
    [_captureButton setImage:[UIImage imageNamed:@"www/img/cameraoverlay/camera393.png"] forState:UIControlStateSelected];
     [_captureButton setImage:[UIImage imageNamed:@"www/img/cameraoverlay/camera393.png"] forState:UIControlStateHighlighted];
    [_captureButton addTarget:self action:@selector(takePictureWaitingForCameraToFocus) forControlEvents:UIControlEventTouchUpInside];
    [overlay addSubview:_captureButton];
    
    _backButton = [UIButton buttonWithType:UIButtonTypeCustom];
    [_backButton setBackgroundImage:[UIImage imageNamed:@"www/img/cameraoverlay/back_button.png"] forState:UIControlStateNormal];
    [_backButton setBackgroundImage:[UIImage imageNamed:@"www/img/cameraoverlay/back_button_pressed.png"] forState:UIControlStateHighlighted];
   // [_backButton setTitle:@"Cancel" forState:UIControlStateNormal];
   // [_backButton setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
   // [[_backButton titleLabel] setFont:[UIFont systemFontOfSize:18]];
    [_backButton addTarget:self action:@selector(dismissCameraPreview) forControlEvents:UIControlEventTouchUpInside];
    [overlay addSubview:_backButton];
    
    
    
    _sendButton = [UIButton buttonWithType:UIButtonTypeCustom];
    [_sendButton setImage:[UIImage imageNamed:@"www/img/cameraoverlay/send.png"] forState:UIControlStateNormal];
    [_sendButton setImage:[UIImage imageNamed:@"www/img/cameraoverlay/send.png"] forState:UIControlStateSelected];
    [_sendButton setImage:[UIImage imageNamed:@"www/img/cameraoverlay/send.png"] forState:UIControlStateHighlighted];
    [_sendButton addTarget:self action:@selector(sendBill) forControlEvents:UIControlEventTouchUpInside];
    [overlay addSubview:_sendButton];
    
    
    _recaptureButton = [UIButton buttonWithType:UIButtonTypeCustom];
    [_recaptureButton setImage:[UIImage imageNamed:@"www/img/cameraoverlay/esc256.png"] forState:UIControlStateNormal];
    [_recaptureButton setImage:[UIImage imageNamed:@"www/img/cameraoverlay/esc256.png"] forState:UIControlStateSelected];
    [_recaptureButton setImage:[UIImage imageNamed:@"www/img/cameraoverlay/esc256.png"] forState:UIControlStateHighlighted];
    [_recaptureButton addTarget:self action:@selector(recapturePhoto) forControlEvents:UIControlEventTouchUpInside];
    [overlay addSubview:_recaptureButton];
    
    
    
    _topLeftGuide = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"www/img/cameraoverlay/border_top_left.png"]];
    [overlay addSubview:_topLeftGuide];
    
    _topRightGuide = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"www/img/cameraoverlay/border_top_right.png"]];
    [overlay addSubview:_topRightGuide];
    
    _bottomLeftGuide = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"www/img/cameraoverlay/border_bottom_left.png"]];
    [overlay addSubview:_bottomLeftGuide];
    
    _bottomRightGuide = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"www/img/cameraoverlay/border_bottom_right.png"]];
    [overlay addSubview:_bottomRightGuide];
    
    
    
    
    _leftPanel = [[UIView alloc] initWithFrame:CGRectZero];
    [_leftPanel setBackgroundColor:[UIColor colorWithWhite:0 alpha:0.55f]];
    [overlay addSubview:_leftPanel];

    _rightPanel = [[UIView alloc] initWithFrame:CGRectZero];
    [_rightPanel setBackgroundColor:[UIColor colorWithWhite:0 alpha:0.55f]];
    [overlay addSubview:_rightPanel];
    
    _topPanel = [[UIView alloc] initWithFrame:CGRectZero];
    [_topPanel setBackgroundColor:[UIColor colorWithWhite:0 alpha:0.55f]];
    [overlay addSubview:_topPanel];
    
    _bottomPanel = [[UIView alloc] initWithFrame:CGRectZero];
    [_bottomPanel setBackgroundColor:[UIColor colorWithWhite:0 alpha:0.55f]];
    [overlay addSubview:_bottomPanel];
    
     CGRect bounds = [[UIScreen mainScreen] bounds];
    
    _photoCountTextView = [[UITextView alloc] initWithFrame:bounds];
   
    [_photoCountTextView setText:@"Фото чека"];
    [_photoCountTextView setTextColor:[UIColor whiteColor]];
    [_photoCountTextView setBackgroundColor:[UIColor clearColor]];
    [_photoCountTextView setTextAlignment:NSTextAlignmentCenter];
    _photoCountTextView.frame=CGRectMake(0, bounds.size.height/2, bounds.size.width, 20);
    [overlay addSubview:_photoCountTextView];
    
    _previousPhoto =[[UIImageView alloc] initWithFrame:CGRectZero];
    [overlay addSubview:_previousPhoto];
    return overlay;
}

- (void)viewWillLayoutSubviews {
    if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad) {
        [self layoutForTablet];
    } else {
        [self layoutForPhone];
    }
}

- (void)layoutForPhone {
    CGRect bounds = [[UIScreen mainScreen] bounds];
    

    
    _buttonPanel.frame = CGRectMake(0,
                                    bounds.size.height- kBigButtonHeightPhone - (kBigButtonVerticalInsetPhone * 2),
                                    bounds.size.width,
                                    kBigButtonHeightPhone + (kBigButtonVerticalInsetPhone * 2));
    
    
    
    CGFloat screenAspectRatio = bounds.size.height / bounds.size.width;
   // if (screenAspectRatio <= 1.5f) {
        [self layoutForPhoneWithShortScreen];
  //  } else {
   //     [self layoutForPhoneWithTallScreen];
   // }
}

- (void)layoutForPhoneWithShortScreen {
    CGRect bounds = [[UIScreen mainScreen] bounds];

    printf("\n");
    printf(" SHORT SCREEN");

    

    CGFloat height = CGRectGetMinY(_buttonPanel.frame) - (kVerticalInsetPhone * 2);
   // CGFloat width = height / kAspectRatio;
  //  CGFloat horizontalInset = (bounds.size.width - width) / 2;
  //  horizontalInset = kHorizontalInsetPhone;
    
  /*  printf("\n");
    printf(" width: ");
    printf("%f",width);
    
    printf("\n");
    printf(" height: ");
    printf("%f",height);*/
    
    
    
    _backButton.frame = CGRectMake(kHorizontalInsetPhone,
                                      _buttonPanel.frame.origin.y+kBigButtonVerticalInsetPhone,
                                    kBigButtonWidthPhone,
                                   kBigButtonHeightPhone
                                     );
    _captureButton.frame = CGRectMake(CGRectGetMaxX(_backButton.frame) +kHorizontalInsetPhone,
                                      CGRectGetMinY(_backButton.frame) ,
                                      kBigButtonWidthPhone,
                                      kBigButtonHeightPhone
                                     );
    _sendButton.frame = CGRectMake(CGRectGetMaxX(_captureButton.frame) +kHorizontalInsetPhone,
                                      CGRectGetMinY(_captureButton.frame) ,
                                      kBigButtonWidthPhone,
                                      kBigButtonHeightPhone
                                      );
    _recaptureButton.frame = CGRectMake(CGRectGetMaxX(_sendButton.frame) +kHorizontalInsetPhone,
                                      CGRectGetMinY(_sendButton.frame) ,
                                      kBigButtonWidthPhone,
                                      kBigButtonHeightPhone
                                      );
    
    
    _topLeftGuide.frame = CGRectMake(kHorizontalInsetPhone,
                                     kVerticalInsetPhone,
                                     kBorderImageWidthPhone,
                                     kBorderImageHeightPhone);

    
    leftMargin = kHorizontalInsetPhone;
    topMargin = kVerticalInsetPhone;
     CGFloat panelHeight = _buttonPanel.frame.size.height;
    buttonHeight =kBigButtonHeightPhone;
     buttonWidth =kBigButtonWidthPhone;
    
    _topRightGuide.frame = CGRectMake(bounds.size.width - kBorderImageWidthPhone - kHorizontalInsetPhone,
                                      kVerticalInsetPhone,
                                      kBorderImageWidthPhone,
                                      kBorderImageHeightPhone);
    

    _bottomLeftGuide.frame = CGRectMake(CGRectGetMinX(_topLeftGuide.frame),
                                        CGRectGetMinY(_topLeftGuide.frame) + height - kBorderImageHeightPhone,
                                        kBorderImageWidthPhone,
                                        kBorderImageHeightPhone);
    
    _bottomRightGuide.frame = CGRectMake(CGRectGetMinX(_topRightGuide.frame),
                                         CGRectGetMinY(_topRightGuide.frame) + height -kBorderImageHeightPhone,
                                         kBorderImageWidthPhone,
                                         kBorderImageHeightPhone);

    [self createShadowLayer:bounds verticalInset:kVerticalInsetPhone horizontalInset:kHorizontalInsetPhone panelHeight:panelHeight height:height];
}

/*- (void)layoutForPhoneWithTallScreen {
    printf("\n");
    printf(" TALL SCREEN");
    
   
    printf("\n");
    printf(" verticalInset: ");
    printf("%f",kVerticalInsetPhone);
    
    printf("\n");
    printf(" horizontalINset: ");
    printf("%f",kHorizontalInsetPhone);
    
    
    CGRect bounds = [[UIScreen mainScreen] bounds];
    _topLeftGuide.frame = CGRectMake(kHorizontalInsetPhone, kVerticalInsetPhone, kBorderImageWidthPhone, kBorderImageHeightPhone);
    
    _leftPanel.frame = CGRectMake(0,
                                  0,
                                  kHorizontalInsetPhone, kVerticalInsetPhone);
    

    
    _topRightGuide.frame = CGRectMake(bounds.size.width - kBorderImageWidthPhone - kHorizontalInsetPhone,
                                      kVerticalInsetPhone,
                                      kBorderImageWidthPhone,
                                      kBorderImageHeightPhone);
    
    leftMargin = kHorizontalInsetPhone;
    topMargin = kVerticalInsetPhone;
    
    CGFloat height = (CGRectGetMaxX(_topRightGuide.frame) - CGRectGetMinX(_topLeftGuide.frame)) * kAspectRatio;
    
    _bottomLeftGuide.frame = CGRectMake(CGRectGetMinX(_topLeftGuide.frame),
                                        CGRectGetMinY(_topLeftGuide.frame) + height - kBorderImageHeightPhone,
                                        kBorderImageWidthPhone,
                                        kBorderImageHeightPhone);
    
    _bottomRightGuide.frame = CGRectMake(CGRectGetMinX(_topRightGuide.frame),
                                         CGRectGetMinY(_topRightGuide.frame) + height - kBorderImageHeightPhone,
                                         kBorderImageWidthPhone,
                                         kBorderImageHeightPhone);
    //CGFloat panelHeight = kBigButtonHeightPhone + (kBigButtonVerticalInsetPhone * 2);
     CGFloat panelHeight = _buttonPanel.frame.size.height;
    [self createShadowLayer:bounds verticalInset:kVerticalInsetPhone horizontalInset:kHorizontalInsetPhone panelHeight:panelHeight height:height];
}*/

- (void)layoutForTablet {
    CGRect bounds = [[UIScreen mainScreen] bounds];
    

    
    
    _buttonPanel.frame = CGRectMake(0,
                                    bounds.size.height- kBigButtonHeightTablet - (kBigButtonVerticalInsetTablet* 2),
                                    bounds.size.width,
                                    kBigButtonHeightTablet + (kBigButtonVerticalInsetTablet * 2));
    
    _backButton.frame = CGRectMake(kHorizontalInsetTablet,
                                      _buttonPanel.frame.origin.y+kBigButtonVerticalInsetTablet,
                                      kBigButtonWidthTablet,
                                      kBigButtonHeightTablet);
    
    _captureButton.frame = CGRectMake(CGRectGetMaxX(_backButton.frame) +kHorizontalInsetTablet,
                                   CGRectGetMinY(_backButton.frame) ,
                                   kBigButtonWidthTablet,
                                   kBigButtonHeightTablet);
    
    _sendButton.frame = CGRectMake(CGRectGetMaxX(_captureButton.frame) +kHorizontalInsetTablet,
                                      CGRectGetMinY(_captureButton.frame) ,
                                      kBigButtonWidthTablet,
                                      kBigButtonHeightTablet);
    
    _recaptureButton.frame = CGRectMake(CGRectGetMaxX(_sendButton.frame) +kHorizontalInsetTablet,
                                      CGRectGetMinY(_sendButton.frame) ,
                                      kBigButtonWidthTablet,
                                      kBigButtonHeightTablet);
    
    
    _topLeftGuide.frame = CGRectMake(kHorizontalInsetTablet, kVerticalInsetTablet, kBorderImageWidthTablet, kBorderImageHeightTablet);
    
    buttonHeight =kBigButtonHeightTablet;
    buttonWidth =kBigButtonWidthTablet;
    
    leftMargin = kHorizontalInsetTablet;
    topMargin = kVerticalInsetTablet;
    
  
    
    _topRightGuide.frame = CGRectMake(bounds.size.width - kBorderImageWidthTablet - kHorizontalInsetTablet,
                                      kVerticalInsetTablet,
                                      kBorderImageWidthTablet,
                                      kBorderImageHeightTablet);
    
    //CGFloat height = (CGRectGetMaxX(_topRightGuide.frame) - CGRectGetMinX(_topLeftGuide.frame)) * kAspectRatio;
     CGFloat height = CGRectGetMinY(_buttonPanel.frame) - (kVerticalInsetTablet * 2);
    _bottomLeftGuide.frame = CGRectMake(CGRectGetMinX(_topLeftGuide.frame),
                                        CGRectGetMinY(_topLeftGuide.frame) + height - kBorderImageHeightTablet,
                                        kBorderImageWidthTablet,
                                        kBorderImageHeightTablet);
    
    _bottomRightGuide.frame = CGRectMake(CGRectGetMinX(_topRightGuide.frame),
                                         CGRectGetMinY(_topRightGuide.frame) + height - kBorderImageHeightTablet,
                                         kBorderImageWidthTablet,
                                         kBorderImageHeightTablet);


         CGFloat panelHeight = _buttonPanel.frame.size.height;
    [self createShadowLayer:bounds verticalInset:kVerticalInsetTablet horizontalInset:kHorizontalInsetTablet panelHeight:panelHeight height:height];

}


- (void)createShadowLayer:(CGRect)bounds verticalInset:(CGFloat)verticalInset horizontalInset:(CGFloat)horizontalInset panelHeight:(CGFloat)panelHeight height:(CGFloat)height {
    printf("\n");
    printf(" panelheight: ");
    printf("%f",panelHeight);
    _leftPanel.frame = CGRectMake(0,
                                  verticalInset,
                                  horizontalInset, bounds.size.height-verticalInset-panelHeight);
    
    _rightPanel.frame = CGRectMake(bounds.size.width-horizontalInset,
                                   verticalInset,
                                   bounds.size.width, bounds.size.height-verticalInset-panelHeight);
    _topPanel.frame = CGRectMake(0,
                                 0,
                                 bounds.size.width,verticalInset);
    _bottomPanel.frame = CGRectMake(_bottomLeftGuide.frame.origin.x,
                                    CGRectGetMaxY(_bottomLeftGuide.frame),
                                    bounds.size.width-horizontalInset*2,
                                    verticalInset);

 //   bottomMargin =  bounds.size.height-_bottomPanel.frame.origin.y-_bottomPanel.frame.size.height;
    bottomMargin =bounds.size.height-(_bottomRightGuide.frame.origin.y+
                                      _bottomRightGuide.frame.size.height
                                      +panelHeight)+_buttonPanel.bounds.size.height;
    
    _previousPhoto.frame=CGRectMake(leftMargin,
                                    0,
                                    bounds.size.width-leftMargin*2,
                                    verticalInset);
    
    _sendButton.frame=CGRectMake(0,0,0,0);
    _recaptureButton.frame=CGRectMake(0,0,0,0);
}

-(void) test:(NSString*)s ph:(NSString*)ph{
    
}


- (void)viewDidLoad {
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_HIGH, 0), ^{
        for (AVCaptureDevice *device in [AVCaptureDevice devices]) {
            if ([device hasMediaType:AVMediaTypeVideo] && [device position] == AVCaptureDevicePositionBack) {
                _rearCamera = device;
            }
        }
        AVCaptureDeviceInput *cameraInput = [AVCaptureDeviceInput deviceInputWithDevice:_rearCamera error:nil];
        [_captureSession addInput:cameraInput];
        _stillImageOutput = [[AVCaptureStillImageOutput alloc] init];
        [_captureSession addOutput:_stillImageOutput];
        [_captureSession startRunning];
        dispatch_async(dispatch_get_main_queue(), ^{
            [_activityIndicator stopAnimating];
        });
    });
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    [[UIApplication sharedApplication] setStatusBarHidden:YES];
}

- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
    [[UIApplication sharedApplication] setStatusBarHidden:NO];
}

- (BOOL)prefersStatusBarHidden {
    return YES;
}

- (NSUInteger)supportedInterfaceOrientations {
    return UIInterfaceOrientationMaskPortrait;
}

- (UIInterfaceOrientation)preferredInterfaceOrientationForPresentation {
    return UIInterfaceOrientationPortrait;
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)orientation {
    return orientation == UIDeviceOrientationPortrait;
}

- (void)dismissCameraPreview {
    [self dismissViewControllerAnimated:YES completion:nil];
}

- (void)takePictureWaitingForCameraToFocus {

   // _captureButton.userInteractionEnabled = NO;
    _captureButton.selected = YES;
    if (_rearCamera.focusPointOfInterestSupported && [_rearCamera isFocusModeSupported:AVCaptureFocusModeAutoFocus]) {
        [_rearCamera addObserver:self forKeyPath:@"adjustingFocus" options:(NSKeyValueObservingOptionOld|NSKeyValueObservingOptionNew) context:nil];
        [self autoFocus];
        [self autoExpose];
    } else {
        [self takePicture];
    }
    
    
}

- (void)autoFocus {
    [_rearCamera lockForConfiguration:nil];
    _rearCamera.focusMode = AVCaptureFocusModeAutoFocus;
    _rearCamera.focusPointOfInterest = CGPointMake(0.5, 0.5);
    [_rearCamera unlockForConfiguration];
}

- (void)autoExpose {
    [_rearCamera lockForConfiguration:nil];
    if (_rearCamera.exposurePointOfInterestSupported && [_rearCamera isExposureModeSupported:AVCaptureExposureModeAutoExpose]) {
        _rearCamera.exposureMode = AVCaptureExposureModeAutoExpose;
        _rearCamera.exposurePointOfInterest = CGPointMake(0.5, 0.5);
    }
    [_rearCamera unlockForConfiguration];
}

- (void)observeValueForKeyPath:(NSString*)keyPath ofObject:(id)object change:(NSDictionary*)change context:(void*)context {
    BOOL wasAdjustingFocus = [[change valueForKey:NSKeyValueChangeOldKey] boolValue];
    BOOL isNowFocused = ![[change valueForKey:NSKeyValueChangeNewKey] boolValue];
    if (wasAdjustingFocus && isNowFocused) {
        [_rearCamera removeObserver:self forKeyPath:@"adjustingFocus"];
        [self takePicture];
    }
}

- (void)takePicture {
    AVCaptureConnection *videoConnection = [self videoConnectionToOutput:_stillImageOutput];
    [_stillImageOutput captureStillImageAsynchronouslyFromConnection:videoConnection completionHandler:^(CMSampleBufferRef imageSampleBuffer, NSError *error) {
        NSData *imageData = [AVCaptureStillImageOutput jpegStillImageNSDataRepresentation:imageSampleBuffer];
        _callback([UIImage imageWithData:imageData]);
    }];
}

- (AVCaptureConnection*)videoConnectionToOutput:(AVCaptureOutput*)output {
    for (AVCaptureConnection *connection in output.connections) {
        for (AVCaptureInputPort *port in [connection inputPorts]) {
            if ([[port mediaType] isEqual:AVMediaTypeVideo]) {
                return connection;
            }
        }
    }
    return nil;
}

- (void) sendBill{
    _callbackSend();
}

-(void) recapturePhoto{
    _callbackRecapture();
}

@end
