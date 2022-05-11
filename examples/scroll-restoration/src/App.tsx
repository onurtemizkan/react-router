import React from "react";
import type { DataRouteMatch, Location } from "react-router-dom";
import {
  DataBrowserRouter,
  ScrollRestoration,
  useLocation,
  Link,
  Route,
  Outlet,
} from "react-router-dom";

function Layout() {
  // You can provide a custom implementation of what "key" should be used to
  // cache scroll positions for a given location.  Using the location.key will
  // provide standard browser behavior and only restore on back/forward
  // navigations.  Using location.pathname will provide more aggressive
  // restoration and will also restore on normal link navigations to a
  // previously-accessed path.  Or - go nuts and lump many pages into a
  // single key (i.e., anything /wizard/* uses the same key)!
  let getKey = React.useCallback(
    (location: Location, matches: DataRouteMatch[]) => {
      let match = matches.find((m) => m.route.handle?.scrollMode);
      if (match?.route.handle?.scrollMode === "pathname") {
        return location.pathname;
      }

      return location.key;
    },
    []
  );

  return (
    <>
      <style>{`
        .wrapper {
          display: grid;
          grid-template-columns: 1fr 2fr;
          padding: 1rem;
        }

        .fixed {
          position: fixed;
          max-width: 20%;
          height: 100%;
          padding: 1rem;
        }

        .navitem {
          margin: 1rem 0;
        }
      `}</style>
      <div className="wrapper">
        <div className="left">
          <div className="fixed">
            <nav>
              <ul>
                <li class="navitem">
                  <Link to="/">Home</Link>
                </li>
                <li class="navitem">
                  <Link to="/restore-by-key">
                    This page restores by location.key
                  </Link>
                </li>
                <li class="navitem">
                  <Link to="/restore-by-pathname">
                    {" "}
                    This page restores by location.pathname
                  </Link>
                </li>
                <li class="navitem">
                  <Link to="/link-to-hash#heading">
                    This link will link to a nested heading via hash
                  </Link>
                </li>
                <li class="navitem">
                  <a href="https://www.google.com">
                    Thi links to an external site (google)
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="right">
          <Outlet />
        </div>
      </div>
      {/* 
        Including this component inside a DataRouter component tree is what 
        enables restoration 
      */}
      <ScrollRestoration getKey={getKey} />
    </>
  );
}

function LongPage() {
  let location = useLocation();
  return (
    <>
      <h2>Long Page</h2>
      {new Array(100).fill(null).map((n, i) => (
        <p key={i}>
          Item {i} on {location.pathname}
        </p>
      ))}
      <h3 id="heading">This is a linkable heading</h3>
      {new Array(100).fill(null).map((n, i) => (
        <p key={i}>
          Item {i + 100} on {location.pathname}
        </p>
      ))}
    </>
  );
}

function App() {
  return (
    <DataBrowserRouter>
      <Route path="/" element={<Layout />}>
        <Route index element={<h2>Home</h2>} />
        <Route path="restore-by-key" element={<LongPage />} />
        <Route
          path="restore-by-pathname"
          element={<LongPage />}
          handle={{ scrollMode: "pathname" }}
        />
        <Route path="link-to-hash" element={<LongPage />} />
      </Route>
    </DataBrowserRouter>
  );
}

export default App;
