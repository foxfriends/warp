import {
  combineLatest,
  store,
  watch,
  interval,
  count,
  map,
} from "./warp/index.mjs";
import {
  render,
  div,
  input,
  button,
  text,
  on,
  attr,
  bindValue,
  steps,
  suspense,
} from "./warp/html/index.mjs";
import { lensProp } from "./warp/store/index.mjs";

async function getCatalog() {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return {
    catalog: [
      { name: "Awesome T-Shirt", price: 19 },
      { name: "Cool Hat", price: 12 },
      { name: "Comfy Pants", price: 24 },
      { name: "Special Socks", price: 8 },
    ],
  };
}

function Product({ name, price, quantity }) {
  return div(
    text`${name} (${quantity.pipe(map((n) => n ?? 0))}):`,
    button(
      text`-`,
      on("click", () => quantity.update((n) => (n ?? 0) - 1))
    ),
    button(
      text`+`,
      on("click", () => quantity.update((n) => (n ?? 0) + 1))
    )
  );
}

function Catalog({ catalog }) {
  const selection = store({});

  function CatalogComponent({ next }) {
    return div(
      ...catalog.map(({ name, price }) => {
        const quantity = selection.pipe(lensProp(name));
        return Product({ name, price, quantity });
      }),
      button(text`Checkout`, on("click", next))
    );
  }

  CatalogComponent[Symbol.asyncIterator] = async function* () {
    yield* watch(selection);
  };

  return CatalogComponent;
}

function ShippingForm() {
  const address = store({
    name: "",
    street: "",
    city: "",
    province: "",
    postalcode: "",
    country: "",
  });

  function ShippingFormComponent({ next, back }) {
    return div(
      input(attr("type", "text"), attr("placeholder", "Name")),
      bindValue(address.pipe(lensProp("name"))),
      input(
        attr("type", "text"),
        attr("placeholder", "Street"),
        bindValue(address.pipe(lensProp("street")))
      ),
      input(
        attr("type", "text"),
        attr("placeholder", "City"),
        bindValue(address.pipe(lensProp("city")))
      ),
      input(
        attr("type", "text"),
        attr("placeholder", "Province"),
        bindValue(address.pipe(lensProp("province")))
      ),
      input(
        attr("type", "text"),
        attr("placeholder", "Postal Code"),
        bindValue(address.pipe(lensProp("postalcode")))
      ),
      input(
        attr("type", "text"),
        attr("placeholder", "Country"),
        bindValue(address.pipe(lensProp("country")))
      ),
      button(text`Back`, on("click", back)),
      button(text`Continue`, on("click", next))
    );
  }

  ShippingFormComponent[Symbol.asyncIterator] = async function* () {
    yield* watch(address);
  };

  return ShippingFormComponent;
}

function BillingForm() {
  const billing = store({
    name: "",
    cardnumber: "",
    postalcode: "",
  });

  function BillingFormComponent({ next, back }) {
    return div(
      text`NOTE: not a real credit card form, data is not sent or stored`,
      input(attr("type", "text"), attr("placeholder", "Name")),
      bindValue(billing.pipe(lensProp("name"))),
      input(
        attr("type", "text"),
        attr("placeholder", "Credit Card Number"),
        bindValue(billing.pipe(lensProp("cardnumber")))
      ),
      input(
        attr("type", "text"),
        attr("placeholder", "Postal Code"),
        bindValue(billing.pipe(lensProp("postalcode")))
      ),
      button(text`Back`, on("click", back)),
      button(text`Continue`, on("click", next))
    );
  }

  BillingFormComponent[Symbol.asyncIterator] = async function* () {
    yield* watch(billing);
  };

  return BillingFormComponent;
}

function ConfirmationScreen({ cart, address, billing }) {
  function ConfirmationScreenComponent({ back }) {
    console.log(cart, address, billing);
    const cartItems = Object.values(cart).reduce((a, b) => a + b, 0);
    return div(
      div(text`You are buying ${cartItems} items.`),
      div(text`Bill To: ${billing.name}`),
      div(text`Ship To: ${address.name}`),
      button(text`Back`, on("click", back))
    );
  }

  return ConfirmationScreenComponent;
}

function Loading() {
  const dots = watch(interval(200)).pipe(
    count(),
    map((n) => n % 3),
    map((n) => ".".repeat(n))
  );

  return text`Loading${dots}`;
}

function Checkout({ catalog }) {
  const cart = Catalog({ catalog });
  const address = ShippingForm();
  const billing = BillingForm();
  const confirm = combineLatest([
    watch(cart),
    watch(address),
    watch(billing),
  ]).pipe(
    map(([cart, address, billing]) =>
      ConfirmationScreen({ cart, address, billing })
    )
  );

  return steps([cart, address, billing, confirm]);
}

function App() {
  const catalog = getCatalog();
  const cart = store([]);

  return suspense(catalog, Loading(), Checkout);
}

await render(document.querySelector("body"), App());
