"use client";

import { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle,
  Circle,
  Loader2,
  Map,
  Package,
  RefreshCcw,
  Truck,
} from "lucide-react";

interface Step {
  title: string;
  subtitle?: string;
  completed: boolean;
  active?: boolean;
}

// Update the interface to match Lalamove's response
interface OrderDetails {
  orderId: string;
  status: string;
  shareLink: string | null;
  driverId?: string | null;
  driverInfo?: {
    name?: string;
    phone?: string;
  };
  distance?: {
    value: string;
    unit: string;
  };
  stops: Array<{
    coordinates: {
      lat: string;
      lng: string;
    };
    address: string;
    name?: string;
    phone?: string;
    POD?: {
      status: string;
      image?: string | null;
      deliveredAt?: string | null;
    };
  }>;
  metadata?: {
    restaurantOrderId?: string;
    restaurantName?: string;
    [key: string]: any;
  };
}

interface StepIndicatorProps {
  initialStep?: number;
  steps?: Step[];
  onStepChange?: (stepIndex: number) => void;
  orderId?: string;
  currentStatus?: string;
}

// Map your application's status codes to step indices
const orderStatusMap: Record<string, number> = {
  ASSIGNING_DRIVER: 0, // Default/initial status
  ON_GOING: 1, // Driver accepted
  PICKED_UP: 2, // Driver has picked up the order
  COMPLETED: 3, // Delivered successfully
  CANCELED: 4, // Order was canceled
};

export default function StepIndicator({
  initialStep = 0,
  steps = [
    { title: "Order Placed", completed: false },
    { title: "On the Way", subtitle: "", completed: false },
    { title: "Picked Up", completed: false },
    { title: "Delivered", completed: false },
    { title: "Completed", completed: false },
  ],
  onStepChange,
  orderId,
  currentStatus,
}: StepIndicatorProps): JSX.Element {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [usingFallback, setUsingFallback] = useState<boolean>(false);

  // Function to fetch order details from the API
  const fetchOrderDetails = async () => {
    if (!orderId) return;

    setLoading(true);
    setError(null);
    setErrorCode(null);

    try {
      const response = await fetch("/api/order-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Store the error code for better handling
        setErrorCode(result.code || response.status);

        // If we get a 502 Bad Gateway or other server error, use fallback
        if (response.status >= 500) {
          setUsingFallback(true);

          // Still throw error to be caught in catch block
          throw new Error(result.message || "Failed to fetch order details");
        } else {
          throw new Error(result.message || "Failed to fetch order details");
        }
      }

      if (!result.data) {
        throw new Error("No order details available");
      }

      // If we got a successful response, clear any fallback state
      setUsingFallback(false);
      setOrderDetails(result.data);

      // Map Lalamove status to our steps
      const statusMapping: Record<string, number> = {
        ASSIGNING_DRIVER: 0,
        ON_GOING: 1,
        PICKED_UP: 2,
        COMPLETED: 3,
        CANCELED: 4,
      };

      const statusStep = statusMapping[result.data.status] || 0;
      setCurrentStep(statusStep);
      if (onStepChange) onStepChange(statusStep);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );

      // Fall back to props if API fails
      if (currentStatus) {
        const statusStep = orderStatusMap[currentStatus] || 0;
        setCurrentStep(statusStep);
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and when orderId changes
  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, retryCount]);

  // Use the currentStatus prop if provided (from db) and no API call is being made
  useEffect(() => {
    if (
      currentStatus &&
      (!orderId || usingFallback) &&
      orderStatusMap[currentStatus] !== undefined
    ) {
      setCurrentStep(orderStatusMap[currentStatus]);
    }
  }, [currentStatus, usingFallback]);

  // Handle manual retry
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  // Update step completion status based on current step
  const processedSteps: Step[] = steps.map((step, index) => ({
    ...step,
    completed: index < currentStep,
    active: index === currentStep,
  }));

  // Function to handle setting current step when clicking on a step
  const handleStepClick = (index: number): void => {
    // Only allow manual step changes in demo mode (when no orderId is provided)
    if (!orderId) {
      setCurrentStep(index);
      if (onStepChange) {
        onStepChange(index);
      }
    }
  };

  // Format delivery status information
  const getDeliveryInfo = () => {
    if (!orderDetails && !currentStatus) return null;

    const status = orderDetails?.status || currentStatus;
    let statusInfo = "";

    switch (status) {
      case "ASSIGNING_DRIVER":
        statusInfo = "Finding a delivery partner for your order...";
        break;
      case "ON_GOING":
        statusInfo = "Your order is on the way!";
        break;
      case "PICKED_UP":
        statusInfo = "Driver has picked up your order and is heading your way";
        break;
      case "COMPLETED":
        statusInfo = "Your order has been delivered successfully";
        break;
      case "CANCELED":
        statusInfo = "This order has been canceled";
        break;
      default:
        statusInfo = "Processing your order";
    }

    return statusInfo;
  };

  // Format distance to be more readable
  const formatDistance = (distance?: { value: string; unit: string }) => {
    if (!distance) return "N/A";

    // Convert meters to kilometers if needed
    if (distance.unit === "m" && parseInt(distance.value) >= 1000) {
      const km = (parseInt(distance.value) / 1000).toFixed(1);
      return `${km} km`;
    }

    return `${distance.value} ${distance.unit}`;
  };

  // Format delivery time
  const formatDeliveryTime = (stop?: any) => {
    if (!stop?.POD?.deliveredAt) return "N/A";

    return new Date(stop.POD.deliveredAt).toLocaleString();
  };

  // Render error states with different messages based on error code
  const renderErrorState = () => {
    const isServerError = errorCode && errorCode >= 500;

    return (
      <div
        className={`bg-${
          isServerError ? "yellow-50" : "red-50"
        } border border-${isServerError ? "yellow-200" : "red-200"} text-${
          isServerError ? "yellow-700" : "red-700"
        } px-4 py-3 rounded mb-6`}
      >
        <div className="flex items-center">
          <AlertCircle
            className={`h-5 w-5 text-${
              isServerError ? "yellow-500" : "red-500"
            } mr-2`}
          />
          <p className="font-medium">
            {isServerError
              ? "Lalamove tracking service is temporarily unavailable"
              : `Error loading order details: ${error}`}
          </p>
        </div>
        <p className="text-sm mt-1">
          {isServerError
            ? "Your order is still being processed. We're showing the latest status from our system."
            : "Please try again later."}
        </p>
        {isServerError && (
          <button
            className="mt-2 flex items-center text-sm font-medium text-yellow-700 hover:text-yellow-900"
            onClick={handleRetry}
          >
            <RefreshCcw className="h-4 w-4 mr-1" />
            Retry connection
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-4 pb-8 px-4">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          <span className="ml-2 text-gray-600">Loading order details...</span>
        </div>
      ) : (
        <>
          {error && renderErrorState()}

          {(orderDetails || currentStatus) && (
            <div className="mb-6">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  Order Status:{" "}
                  {(orderDetails?.status || currentStatus || "").replace(
                    /_/g,
                    " "
                  )}
                  {usingFallback && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                      Last known status
                    </span>
                  )}
                </h2>
                <p className="text-gray-600">{getDeliveryInfo()}</p>

                {orderDetails?.driverInfo && (
                  <div className="mt-3 p-3 bg-white rounded border border-gray-100">
                    <p className="font-medium">Driver Information</p>
                    <p className="text-sm text-gray-600">
                      Name: {orderDetails.driverInfo.name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Phone: {orderDetails.driverInfo.phone || "N/A"}
                    </p>
                  </div>
                )}

                {/* Display distance information if available */}
                {orderDetails?.distance && (
                  <div className="mt-3 flex items-center">
                    <Truck className="w-4 h-4 text-gray-500 mr-2" />
                    <p className="text-sm text-gray-600">
                      Delivery Distance: {formatDistance(orderDetails.distance)}
                    </p>
                  </div>
                )}

                {/* Delivery metadata if available */}
                {orderDetails?.metadata && (
                  <div className="mt-3 text-sm text-gray-600">
                    {orderDetails.metadata.restaurantName && (
                      <p>Restaurant: {orderDetails.metadata.restaurantName}</p>
                    )}
                    {orderDetails.metadata.restaurantOrderId && (
                      <p>
                        Restaurant Order ID:{" "}
                        {orderDetails.metadata.restaurantOrderId}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Live tracking map using Lalamove shareLink - only show if we have real data */}
              {orderDetails?.shareLink && !usingFallback && (
                <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-3 border-b border-gray-200 flex items-center">
                    <Map className="w-5 h-5 text-green-500 mr-2" />
                    <h3 className="font-medium text-gray-900">
                      Live Order Tracking
                    </h3>
                  </div>
                  <div className="w-full h-64 bg-gray-50 relative">
                    <iframe
                      src={orderDetails.shareLink}
                      className="w-full h-full border-none"
                      title="Order Tracking Map"
                      allow="geolocation"
                      sandbox="allow-scripts allow-same-origin allow-popups"
                      loading="lazy"
                    />
                    {orderDetails.status === "COMPLETED" && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-4 rounded-lg text-center">
                          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                          <p className="font-medium">Delivery Completed</p>
                          <p className="text-sm text-gray-600 mt-1">
                            The tracking session has ended
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Note:</span> This map shows
                      the real-time location of your delivery driver. If it
                      doesn't load,{" "}
                      <a
                        href={orderDetails.shareLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        open it in a new tab
                      </a>
                      .
                    </p>
                  </div>
                </div>
              )}

              {/* Static map placeholder when live tracking is unavailable */}
              {usingFallback && orderId && (
                <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-3 border-b border-gray-200 flex items-center">
                    <Map className="w-5 h-5 text-yellow-500 mr-2" />
                    <h3 className="font-medium text-gray-900">
                      Order Tracking
                    </h3>
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                      Live tracking unavailable
                    </span>
                  </div>
                  <div className="w-full h-64 bg-gray-100 flex flex-col items-center justify-center p-6 text-center">
                    <div className="mb-4 p-3 bg-white rounded-full">
                      <Truck className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">
                      Live tracking is temporarily unavailable
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      We're still monitoring your delivery based on the latest
                      information from our system.
                    </p>
                    <button
                      className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 flex items-center"
                      onClick={handleRetry}
                    >
                      <RefreshCcw className="w-4 h-4 mr-2" />
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* Delivery route information - only show if we have real data */}
              {orderDetails?.stops &&
                orderDetails.stops.length > 0 &&
                !usingFallback && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center mb-3">
                      <Package className="w-5 h-5 text-gray-600 mr-2" />
                      <h3 className="font-medium text-gray-900">
                        Delivery Route
                      </h3>
                    </div>

                    {orderDetails.stops.map((stop, index) => {
                      // Handle different stop structure formats
                      const address =
                        typeof stop.address === "string"
                          ? stop.address
                          : stop.address || "Unknown address";

                      return (
                        <div
                          key={index}
                          className="flex items-start mt-3 pb-3 border-b border-gray-100 last:border-0"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5
                          ${
                            index === 0
                              ? "bg-blue-100 text-blue-600"
                              : "bg-green-100 text-green-600"
                          }`}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 font-medium">
                              {index === 0
                                ? "Pickup Location"
                                : "Delivery Location"}
                            </p>
                            <p className="text-sm text-gray-600">{address}</p>

                            {stop.name && (
                              <p className="text-sm text-gray-600 mt-1">
                                Recipient: {stop.name}
                              </p>
                            )}

                            {stop.phone && (
                              <p className="text-sm text-gray-600">
                                Phone: {stop.phone}
                              </p>
                            )}

                            {/* Show delivery confirmation for the last stop */}
                            {index > 0 && stop.POD && (
                              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                <p className="text-green-600 font-medium">
                                  {stop.POD.status === "DELIVERED"
                                    ? "✓ Delivered"
                                    : stop.POD.status}
                                </p>
                                {stop.POD.deliveredAt && (
                                  <p className="text-gray-500 text-xs">
                                    at {formatDeliveryTime(stop)}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          )}

          {/* Step indicator */}
          <div className="flex items-center justify-between">
            {processedSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center relative">
                {/* Step circle and line */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2
                    ${
                      step.completed || step.active
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-white border-gray-300 text-gray-300"
                    }
                    ${!orderId ? "cursor-pointer hover:opacity-80" : ""}`}
                  onClick={() => handleStepClick(index)}
                >
                  {step.completed ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </div>

                {/* Line connecting to next step */}
                {index < processedSteps.length - 1 && (
                  <div
                    className={`absolute top-6 left-12 h-0.5 w-full
                      ${index < currentStep ? "bg-green-500" : "bg-gray-200"}`}
                  />
                )}

                {/* Step title */}
                <div className="mt-3 text-center">
                  <p
                    className={`text-sm font-medium ${
                      index <= currentStep ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </p>
                  {step.subtitle && (
                    <p className="text-xs text-gray-500">{step.subtitle}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Demo controls - Only show when no orderId is provided */}
          {!orderId && !currentStatus && (
            <div className="mt-12 flex justify-center space-x-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
                onClick={() => handleStepClick(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous Step
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
                onClick={() =>
                  handleStepClick(
                    Math.min(processedSteps.length - 1, currentStep + 1)
                  )
                }
                disabled={currentStep === processedSteps.length - 1}
              >
                Next Step
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
