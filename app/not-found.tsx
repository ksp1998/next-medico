import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "Not Found | Medico",
};

const NotFound = async () => {
  const session = await getServerSession();

  return (
    <>
      {session && <Header heading="Not Found" />}

      <div className="container bg-white" style={{ height: "96vh" }}>
        <div className="row h-100 align-items-center text-center">
          <div className="col-md-12">
            <div className="d-flex align-items-center justify-content-center">
              <div className="text-center">
                <h1 className="display-1 fw-bold">404</h1>
                <p className="fs-3">
                  <span className="text-danger">Oops!</span> Page not found.
                </p>
                <p className="lead">
                  The page you’re looking for doesn’t exist.
                </p>
                <Link href="/" className="btn btn-lg">
                  Go to {session ? "Dashboard" : "Login"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
