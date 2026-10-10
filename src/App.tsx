import { useEffect, useMemo, useRef, useState } from "react";

type ProductCategory = "Jewelry" | "Pocket things" | "Paper goods";
type CategoryFilter = "all" | ProductCategory;

type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  detail: string;
  price: number;
  image: string;
  alt: string;
  surface: string;
  note?: string;
};

const products: Product[] = [
  {
    id: "form-ring",
    name: "Form signet ring",
    category: "Jewelry",
    detail: "Recycled sterling silver",
    price: 68,
    image: "./images/product-ring.jpg",
    alt: "Sculptural sterling silver signet ring on sunlit stone",
    surface: "#e3ded2",
    note: "Best seller",
  },
  {
    id: "everyday-chain",
    name: "Everyday chain",
    category: "Jewelry",
    detail: "Sterling silver, 18 cm",
    price: 54,
    image: "./images/product-bracelet.jpg",
    alt: "Delicate silver chain bracelet arranged on linen",
    surface: "#e7e3d9",
  },
  {
    id: "keepsake-locket",
    name: "Keep close locket",
    category: "Pocket things",
    detail: "Locket keychain in silver",
    price: 42,
    image: "./images/product-locket.jpg",
    alt: "Brushed silver locket keychain on olive canvas and stone",
    surface: "#c7c2b2",
    note: "New",
  },
  {
    id: "field-notes",
    name: "Field notes, set of two",
    category: "Paper goods",
    detail: "Clothbound pocket notebooks",
    price: 22,
    image: "./images/product-notebook.jpg",
    alt: "Forest green pocket notebook with a brass pen in warm sunlight",
    surface: "#e6e1d6",
  },
];

const filters: { label: string; value: CategoryFilter }[] = [
  { label: "Everything", value: "all" },
  { label: "Jewelry", value: "Jewelry" },
  { label: "Pocket things", value: "Pocket things" },
  { label: "Paper goods", value: "Paper goods" },
];

const money = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

function Mark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 36 36" fill="none">
      <circle cx="14" cy="18" r="8" />
      <circle cx="22" cy="18" r="8" />
      <circle cx="18" cy="18" r="2" className="mark-dot" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <circle cx="10.8" cy="10.8" r="6.7" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M4.5 8.5h15l1 12h-17l1-12Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
    >
      <path d="M20.4 8.7c0 4.4-8.4 10-8.4 10s-8.4-5.6-8.4-10a4.4 4.4 0 0 1 8.4-1.8 4.4 4.4 0 0 1 8.4 1.8Z" />
    </svg>
  );
}

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      {diagonal ? (
        <path d="M6 18 18 6M7 6h11v11" />
      ) : (
        <path d="M4 12h15m-6-6 6 6-6 6" />
      )}
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      {open ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
    </svg>
  );
}

function ProductCard({
  product,
  index,
  isSaved,
  onSave,
  onAdd,
}: {
  product: Product;
  index: number;
  isSaved: boolean;
  onSave: () => void;
  onAdd: () => void;
}) {
  return (
    <article className="product" style={{ animationDelay: `${index * 75}ms` }}>
      <div className="product__visual" style={{ backgroundColor: product.surface }}>
        <img src={product.image} alt={product.alt} loading="lazy" />
        {product.note && <span className="product__note">{product.note}</span>}
        <button
          className={`save-button${isSaved ? " is-saved" : ""}`}
          type="button"
          onClick={onSave}
          aria-label={isSaved ? `Remove ${product.name} from saved pieces` : `Save ${product.name}`}
          aria-pressed={isSaved}
        >
          <HeartIcon filled={isSaved} />
        </button>
        <button className="quick-add" type="button" onClick={onAdd}>
          <span>Add to bag</span>
          <span className="quick-add__plus" aria-hidden="true">+</span>
        </button>
      </div>
      <div className="product__meta">
        <div>
          <p className="product__category">{product.category}</p>
          <h3>{product.name}</h3>
          <p className="product__detail">{product.detail}</p>
        </div>
        <span className="product__price">{money(product.price)}</span>
      </div>
    </article>
  );
}

export default function App() {
  const [checkoutStep, setCheckoutStep] = useState<"bag" | "details" | "complete">("bag");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [bag, setBag] = useState<Record<string, number>>({});
  const [bagOpen, setBagOpen] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const visibleProducts = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const matchesSearch =
        !query ||
        `${product.name} ${product.category} ${product.detail}`.toLowerCase().includes(query);
      const matchesSaved = !showSavedOnly || savedItems.includes(product.id);
      return matchesCategory && matchesSearch && matchesSaved;
    });
  }, [category, savedItems, searchText, showSavedOnly]);

  const bagItems = products.flatMap((product) => {
    const quantity = bag[product.id];
    return quantity ? [{ product, quantity }] : [];
  });
  const bagCount = Object.values(bag).reduce((total, quantity) => total + quantity, 0);
  const bagTotal = bagItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!bagOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setBagOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [bagOpen]);

  const scrollToShop = (nextCategory: CategoryFilter = "all") => {
    setCategory(nextCategory);
    setShowSavedOnly(false);
    setSearchText("");
    setMobileMenuOpen(false);
    setSearchOpen(false);
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleSavedView = () => {
    const next = !showSavedOnly;
    setShowSavedOnly(next);
    setCategory("all");
    setSearchText("");
    setSearchOpen(false);
    setMobileMenuOpen(false);
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleSaved = (id: string) => {
    setSavedItems((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const addToBag = (product: Product) => {
    setBag((current) => ({ ...current, [product.id]: (current[product.id] ?? 0) + 1 }));
    setCheckoutStep("bag");
    setBagOpen(true);
  };

  const openBag = () => {
    setCheckoutStep("bag");
    setBagOpen(true);
  };

  const changeQuantity = (id: string, change: number) => {
    setBag((current) => {
      const nextQuantity = (current[id] ?? 0) + change;
      if (nextQuantity <= 0) {
        const next = { ...current };
        delete next[id];
        return next;
      }
      return { ...current, [id]: nextQuantity };
    });
  };

  const handleNewsletter = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  const handleCheckout = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBag({});
    setCheckoutStep("complete");
  };

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchOpen(false);
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="site-shell" id="top">
      <div className="announcement">
        <p>Small pieces, made to mean something.</p>
        <a href="#shop" onClick={() => scrollToShop()}>
          Explore the collection <ArrowIcon />
        </a>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="KIN Objects home">
            <span className="brand__mark"><Mark /></span>
            <span className="brand__wordmark">
              <span>KIN</span>
              <small>OBJECTS</small>
            </span>
          </a>

          <nav className="desktop-nav" aria-label="Main navigation">
            <button type="button" onClick={() => scrollToShop()}>Shop all</button>
            <button type="button" onClick={() => scrollToShop("Jewelry")}>Jewelry</button>
            <button type="button" onClick={() => scrollToShop("Pocket things")}>Pocket things</button>
            <button type="button" onClick={() => scrollToShop("Paper goods")}>Paper goods</button>
            <a href="#story">Our story</a>
          </nav>

          <div className="header-actions">
            <button
              className="header-icon"
              type="button"
              aria-label={searchOpen ? "Close search" : "Search the collection"}
              aria-expanded={searchOpen}
              onClick={() => {
                setSearchOpen((open) => !open);
                setMobileMenuOpen(false);
              }}
            >
              {searchOpen ? <CloseIcon /> : <SearchIcon />}
            </button>
            <button
              className={`header-icon saved-shortcut${showSavedOnly ? " is-active" : ""}`}
              type="button"
              aria-label={`Show saved pieces, ${savedItems.length} saved`}
              aria-pressed={showSavedOnly}
              onClick={toggleSavedView}
            >
              <HeartIcon filled={showSavedOnly} />
              {savedItems.length > 0 && <span className="header-count">{savedItems.length}</span>}
            </button>
            <button
              className="header-icon bag-shortcut"
              type="button"
              aria-label={`Open shopping bag, ${bagCount} ${bagCount === 1 ? "item" : "items"}`}
              onClick={openBag}
            >
              <BagIcon />
              <span className="header-count">{bagCount}</span>
            </button>
            <button
              className="header-icon menu-toggle"
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => {
                setMobileMenuOpen((open) => !open);
                setSearchOpen(false);
              }}
            >
              <MenuIcon open={mobileMenuOpen} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <button type="button" onClick={() => scrollToShop()}>Shop everything <ArrowIcon /></button>
            <button type="button" onClick={() => scrollToShop("Jewelry")}>Jewelry <ArrowIcon /></button>
            <button type="button" onClick={() => scrollToShop("Pocket things")}>Pocket things <ArrowIcon /></button>
            <button type="button" onClick={() => scrollToShop("Paper goods")}>Paper goods <ArrowIcon /></button>
            <a href="#story" onClick={() => setMobileMenuOpen(false)}>Our story <ArrowIcon /></a>
          </nav>
        )}

        {searchOpen && (
          <div className="search-panel">
            <form className="search-panel__inner" onSubmit={submitSearch}>
              <SearchIcon />
              <input
                ref={searchRef}
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Try a ring, a notebook, a keepsake..."
                aria-label="Search products"
              />
              {searchText && (
                <button type="button" className="search-clear" onClick={() => setSearchText("")}>
                  Clear
                </button>
              )}
              <button className="search-submit" type="submit" aria-label="See search results">
                <ArrowIcon />
              </button>
            </form>
            <p className="search-hint">
              {searchText
                ? `${visibleProducts.length} ${visibleProducts.length === 1 ? "piece" : "pieces"} to explore`
                : "Thoughtful things for wherever the day takes you."}
            </p>
          </div>
        )}
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <img
            className="hero__image"
            src="./images/hero-still-life.jpg"
            alt="Silver jewelry, a keepsake locket, and a notebook arranged in late afternoon light"
            fetchPriority="high"
          />
          <div className="hero__veil" />
          <div className="hero__content">
            <p className="hero__eyebrow">SMALL THINGS, BETTER KEPT</p>
            <h1 className="hero__title" id="hero-title">
              <span className="hero__name">KIN</span>
              <span className="hero__descriptor">OBJECTS<br />FOR EVERY DAY</span>
            </h1>
            <p className="hero__copy">Wearable keepsakes, pocket pieces, and paper goods made for all of us.</p>
            <div className="hero__actions">
              <a className="button button--light" href="#shop" onClick={() => scrollToShop()}>
                Shop the collection <ArrowIcon />
              </a>
              <a className="text-link text-link--light" href="#story">
                Get to know us <ArrowIcon diagonal />
              </a>
            </div>
          </div>
        </section>

        <div className="ticker" aria-label="Made for every body, made for every day">
          <div className="ticker__track" aria-hidden="true">
            {Array.from({ length: 4 }, (_, index) => (
              <span className="ticker__group" key={index}>
                <span>MADE FOR EVERY BODY</span>
                <span className="ticker__mark"><Mark /></span>
                <span>GOOD THINGS, KEPT CLOSE</span>
                <span className="ticker__mark"><Mark /></span>
                <span>MADE FOR THE EVERYDAY</span>
                <span className="ticker__mark"><Mark /></span>
              </span>
            ))}
          </div>
        </div>

        <section className="shop-section" id="shop" aria-labelledby="shop-title">
          <div className="shop-heading">
            <div>
              <p className="eyebrow">THE GOOD THINGS EDIT</p>
              <h2 id="shop-title">Made for the everyday.</h2>
            </div>
            <p className="shop-heading__note">Keep one. Give one. Make it yours.</p>
          </div>

          <div className="shop-toolbar">
            <div className="filter-list" role="group" aria-label="Filter products by category">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  className={`filter-button${category === filter.value && !showSavedOnly ? " is-active" : ""}`}
                  type="button"
                  aria-pressed={category === filter.value && !showSavedOnly}
                  onClick={() => {
                    setCategory(filter.value);
                    setShowSavedOnly(false);
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            {showSavedOnly ? (
              <button
                className="saved-filter"
                type="button"
                onClick={() => setShowSavedOnly(false)}
              >
                Saved pieces <span>{savedItems.length}</span> <CloseIcon />
              </button>
            ) : (
              <span className="item-count">{visibleProducts.length} pieces</span>
            )}
          </div>

          {visibleProducts.length > 0 ? (
            <div className="product-grid">
              {visibleProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  isSaved={savedItems.includes(product.id)}
                  onSave={() => toggleSaved(product.id)}
                  onAdd={() => addToBag(product)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-products">
              <p className="eyebrow">NOTHING HERE JUST YET</p>
              <h3>{showSavedOnly ? "Your saved pieces will feel right at home here." : "Try another search."}</h3>
              <button
                className="text-link"
                type="button"
                onClick={() => {
                  setSearchText("");
                  setCategory("all");
                  setShowSavedOnly(false);
                }}
              >
                See everything <ArrowIcon />
              </button>
            </div>
          )}
        </section>

        <section className="story-section" id="story" aria-labelledby="story-title">
          <div className="story-photo">
            <img
              src="./images/story-lifestyle.jpg"
              alt="A hand wearing a silver ring and bracelet while writing in a pocket notebook"
              loading="lazy"
            />
            <p className="story-photo__caption">WORN, USED, AND ALL YOURS.</p>
          </div>
          <div className="story-copy">
            <p className="eyebrow">OUR POINT OF VIEW</p>
            <h2 id="story-title">Good things have <em>no dress code.</em></h2>
            <p>
              No his or hers. No special occasion required. Just honest materials, considered forms,
              and the freedom to make a little something your own.
            </p>
            <a className="text-link" href="#shop" onClick={() => scrollToShop()}>
              Find your everyday piece <ArrowIcon />
            </a>
            <span className="story-copy__signoff">MADE TO MOVE WITH YOU</span>
          </div>
        </section>

        <section className="newsletter" aria-labelledby="newsletter-title">
          <div className="newsletter__inner">
            <div className="newsletter__intro">
              <p className="eyebrow">A NOTE FROM KIN</p>
              <h2 id="newsletter-title">Good things, <em>occasionally.</em></h2>
              <p>New pieces, small stories, and a little something for your inbox. Never noise.</p>
            </div>
            <div className="newsletter__signup">
              {subscribed ? (
                <p className="newsletter__success" role="status">
                  You are on the list. Keep an eye out for a little something from us.
                </p>
              ) : (
                <form onSubmit={handleNewsletter}>
                  <label className="sr-only" htmlFor="newsletter-email">Email address</label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Your email address"
                    required
                  />
                  <button type="submit" aria-label="Sign up for the KIN newsletter">
                    Join us <ArrowIcon />
                  </button>
                </form>
              )}
              <p className="newsletter__privacy">A considered note, now and then. Unsubscribe any time.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand-block">
            <a className="brand brand--light" href="#top" aria-label="KIN Objects home">
              <span className="brand__mark"><Mark /></span>
              <span className="brand__wordmark"><span>KIN</span><small>OBJECTS</small></span>
            </a>
            <p>Thoughtful things for wherever the day takes you.</p>
          </div>
          <div className="footer-links">
            <p className="footer-label">EXPLORE</p>
            <a href="#shop" onClick={() => scrollToShop()}>Shop all</a>
            <a href="#shop" onClick={() => scrollToShop("Jewelry")}>Jewelry</a>
            <a href="#shop" onClick={() => scrollToShop("Pocket things")}>Pocket things</a>
            <a href="#shop" onClick={() => scrollToShop("Paper goods")}>Paper goods</a>
          </div>
          <div className="footer-links">
            <p className="footer-label">SAY HELLO</p>
            <a href="mailto:hello@kinobjects.com">hello@kinobjects.com <ArrowIcon diagonal /></a>
            <a href="#story">Our point of view</a>
            <a href="#newsletter-title">Letters from KIN</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>(c) 2026 KIN OBJECTS</span>
          <span>MADE WITH CARE, FOR EVERYONE.</span>
          <a href="#top">Back to top</a>
        </div>
      </footer>

      {bagOpen && (
        <div className="drawer-backdrop" onClick={() => setBagOpen(false)}>
          <aside
            className="bag-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bag-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="bag-drawer__header">
              <div>
                <p className="eyebrow">
                  {checkoutStep === "complete" ? "PREVIEW ORDER" : checkoutStep === "details" ? "ALMOST YOURS" : "A FEW GOOD THINGS"}
                </p>
                <h2 id="bag-title">
                  {checkoutStep === "complete" ? "All yours." : checkoutStep === "details" ? "Your details" : "Your bag"}
                  {checkoutStep === "bag" && <span> ({bagCount})</span>}
                </h2>
              </div>
              <button className="drawer-close" type="button" onClick={() => setBagOpen(false)} aria-label="Close bag">
                <CloseIcon />
              </button>
            </div>
            {checkoutStep === "complete" ? (
              <div className="bag-empty bag-complete">
                <span className="bag-empty__mark"><Mark /></span>
                <h3>Consider it yours, {buyerName.trim().split(" ")[0] || "friend"}.</h3>
                <p>Your sample order is confirmed. This preview does not collect payment or send personal details.</p>
                <button
                  className="button button--dark"
                  type="button"
                  onClick={() => {
                    setBagOpen(false);
                    setCheckoutStep("bag");
                    setBuyerName("");
                    setBuyerEmail("");
                  }}
                >
                  Back to the collection <ArrowIcon />
                </button>
              </div>
            ) : checkoutStep === "details" ? (
              <form className="checkout-form" onSubmit={handleCheckout}>
                <p className="checkout-preview-note">A sample checkout for this storefront preview. No payment will be taken.</p>
                <label htmlFor="buyer-name">Your name</label>
                <input
                  id="buyer-name"
                  type="text"
                  value={buyerName}
                  onChange={(event) => setBuyerName(event.target.value)}
                  autoComplete="name"
                  required
                />
                <label htmlFor="buyer-email">Email address</label>
                <input
                  id="buyer-email"
                  type="email"
                  value={buyerEmail}
                  onChange={(event) => setBuyerEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
                <div className="checkout-form__summary">
                  <span>{bagCount} {bagCount === 1 ? "piece" : "pieces"}</span>
                  <strong>{money(bagTotal)}</strong>
                </div>
                <button className="checkout-button" type="submit">
                  Place a sample order <ArrowIcon />
                </button>
                <button className="continue-shopping" type="button" onClick={() => setCheckoutStep("bag")}>
                  Return to your bag
                </button>
              </form>
            ) : bagItems.length > 0 ? (
              <>
                <div className="bag-items">
                  {bagItems.map(({ product, quantity }) => (
                    <div className="bag-item" key={product.id}>
                      <div className="bag-item__image" style={{ backgroundColor: product.surface }}>
                        <img src={product.image} alt="" />
                      </div>
                      <div className="bag-item__info">
                        <div className="bag-item__heading">
                          <div>
                            <h3>{product.name}</h3>
                            <p>{product.detail}</p>
                          </div>
                          <span>{money(product.price * quantity)}</span>
                        </div>
                        <div className="quantity-control" aria-label={`Quantity for ${product.name}`}>
                          <button type="button" onClick={() => changeQuantity(product.id, -1)} aria-label="Decrease quantity">-</button>
                          <span>{quantity}</span>
                          <button type="button" onClick={() => changeQuantity(product.id, 1)} aria-label="Increase quantity">+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bag-drawer__footer">
                  <div className="bag-subtotal"><span>Subtotal</span><strong>{money(bagTotal)}</strong></div>
                  <p>Shipping and any applicable taxes are calculated at checkout.</p>
                  <button className="checkout-button" type="button" onClick={() => setCheckoutStep("details")}>
                    Continue to checkout <ArrowIcon />
                  </button>
                  <button className="continue-shopping" type="button" onClick={() => setBagOpen(false)}>
                    Keep looking around
                  </button>
                </div>
              </>
            ) : (
              <div className="bag-empty">
                <span className="bag-empty__mark"><Mark /></span>
                <h3>Something good belongs here.</h3>
                <p>Make a little room for the things you will keep close.</p>
                <button
                  className="button button--dark"
                  type="button"
                  onClick={() => {
                    setBagOpen(false);
                    scrollToShop();
                  }}
                >
                  Explore the collection <ArrowIcon />
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}