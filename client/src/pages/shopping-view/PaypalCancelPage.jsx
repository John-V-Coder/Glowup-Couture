import { Link } from "react-router-dom";

function PaypalCancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6">
      <div className="max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Canceled</h1>
        <p className="text-gray-600 mb-6">
          Your PayPal transaction was canceled. No charges were made.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/shop/checkout"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Try Again
          </Link>
          <Link
            to="/"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PaypalCancelPage;
