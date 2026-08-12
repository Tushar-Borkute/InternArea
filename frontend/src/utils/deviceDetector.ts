export interface DeviceInfo {
  browser: string;
  os: string;
  deviceType: "desktop" | "laptop" | "mobile";
}

export const detectDeviceInfo = (): DeviceInfo => {
  const ua = navigator.userAgent;

  // 1. Detect Operating System
  let os = "Unknown OS";
  if (/windows nt/i.test(ua)) {
    os = "Windows";
  } else if (/mac os x/i.test(ua)) {
    os = /iphone|ipad|ipod/i.test(ua) ? "iOS" : "macOS";
  } else if (/android/i.test(ua)) {
    os = "Android";
  } else if (/linux/i.test(ua)) {
    os = "Linux";
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    os = "iOS";
  }

  // 2. Detect Browser
  let browser = "Unknown Browser";
  if (/edg/i.test(ua)) {
    browser = "Microsoft Edge";
  } else if (/opr|opera/i.test(ua)) {
    browser = "Opera";
  } else if (/chrome|crios/i.test(ua)) {
    browser = "Google Chrome";
  } else if (/firefox|fxios/i.test(ua)) {
    browser = "Mozilla Firefox";
  } else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) {
    browser = "Apple Safari";
  }

  // 3. Detect Device Type (mobile, laptop, or desktop)
  let deviceType: "desktop" | "laptop" | "mobile" = "desktop";

  const isMobileUA = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
  const isTouchScreen = navigator.maxTouchPoints > 0;
  const screenWidth = window.screen?.width || window.innerWidth;

  if (isMobileUA || (screenWidth <= 768 && isTouchScreen)) {
    deviceType = "mobile";
  } else {
    // Distinguish laptop vs desktop based on touch capability & screen resolution
    // Standard laptops usually have screen height/width or touch capabilities or battery API
    if (isTouchScreen || screenWidth <= 1536) {
      deviceType = "laptop";
    } else {
      deviceType = "desktop";
    }
  }

  return { browser, os, deviceType };
};
