import supertest from "supertest";
import { expect } from "chai";
import { ADMIN_EMAIL, ADMIN_PASSWORD, BASE_API_URL, CARTS_ROUTE, PRODUCTS_ROUTE, SESSIONS_ROUTE } from "../src/config/config.js";

describe("Functional test for cart router endpoints", () => {
  let requester;
  let authToken;
  beforeEach(async () => {
    requester = supertest(`${BASE_API_URL}`);
    const response = await requester
      .post(`${SESSIONS_ROUTE}/login`)
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    const cookie = {
      name: response.headers["set-cookie"][0].split("=")[0],
      value: response.headers["set-cookie"][0].split("=")[1].split(";")[0],
    };
    authToken = response.headers["set-cookie"][0];
  });
  it("Should GET /api/carts - succesfully get all carts as admin with code 200", async () => {
    const { statusCode, ok, _body } = await requester
      .get(`${CARTS_ROUTE}`)
      .set("Cookie", authToken);
    expect(statusCode).to.equal(200);
    expect(_body).to.have.property("carts");
    expect(_body.carts).to.be.an("array");
  });
  it("Should DELETE /api/carts/:cid - succesfully delete a cart by its id with code 200", async () => {
    const { statusCode, ok, _body } = await requester.post(`${CARTS_ROUTE}`);
    expect(statusCode).to.equal(200);
    expect(ok).to.be.ok;
    expect(_body.cart.products).to.deep.equal([]);
    expect(_body.cart).to.have.property("_id");
    const cartId = _body.cart._id;
    const { statusCode: deleteStatusCode } = await requester
      .delete(`${CARTS_ROUTE}/${cartId}`)
      .set("Cookie", authToken);
    expect(deleteStatusCode).to.equal(200);
  });
  it("Should GET /api/carts/:cid - succesfully get a cart by id with code 200", async () => {
    const { statusCode, ok, _body } = await requester.post(`${CARTS_ROUTE}`);
    expect(statusCode).to.equal(200);
    expect(ok).to.be.ok;
    const {
      statusCode: cartStatusCode,
      ok: cartOk,
      _body: cart,
    } = await requester.get(`${CARTS_ROUTE}/${_body.cart._id}`);
    expect(cartStatusCode).to.equal(200);
    expect(cartOk).to.be.ok;
    expect(cart.cart).to.have.property("_id");
    expect(cart.cart.products).to.deep.equal([]);
  });
});
describe("Functional test for product router endpoints", () => {
  let requester;
  let authToken;
  beforeEach(async () => {
    requester = supertest(`${BASE_API_URL}`);
    const response = await requester
      .post(`${SESSIONS_ROUTE}/login`)
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    const cookie = {
      name: response.headers["set-cookie"][0].split("=")[0],
      value: response.headers["set-cookie"][0].split("=")[1].split(";")[0],
    };
    authToken = response.headers["set-cookie"][0];
  });
  it("Should GET /api/products - successfully get all products with code 200", async () => {
    const { statusCode, ok, _body } = await requester.get(`${PRODUCTS_ROUTE}`);
    expect(statusCode).to.equal(200);
    expect(ok).to.be.ok;
    expect(_body).to.have.property("products");
  });
  it("Should GET /api/products/:pid - successfully get a product by its id with code 200", async () => {
    const { _body } = await requester.get(`${PRODUCTS_ROUTE}`);

    const {
      statusCode,
      ok,
      _body: product,
    } = await requester.get(`${PRODUCTS_ROUTE}/${_body.products[0]._id}`);
    expect(statusCode).to.equal(200);
    expect(ok).to.be.ok;
    expect(product).to.have.property("product");
    expect(product.product).to.have.property("owner");
    expect(product.product.owner).to.equal("admin");
  });
  it("Should DELETE /api/products/:pid - successfully delete a product with code 200", async () => {
    const productBody = {
      title: "Producto de prueba con SuperTest",
      description:
        "Descripción del producto de prueba creado para ser eliminado con prueba de endpoint DELETE api/products/:pid",
      code: 234567,
      price: 1000,
      status: "no disponible",
      stock: 100,
      category: "Prueba",
    };
    const { _body } = await requester
      .post(`${PRODUCTS_ROUTE}`)
      .send(productBody)
      .set("Cookie", authToken);
    const product = _body.productBody;
    expect(product).to.have.property("_id");
    const productId = _body.productBody._id;
    const { statusCode, ok } = await requester
      .delete(`${PRODUCTS_ROUTE}/${productId}`)
      .set("Cookie", authToken);
    expect(statusCode).to.equal(200);
    expect(ok).to.be.ok;
  });
});
describe("Functional test for session router endpoints", () => {
  let requester;
  beforeEach(() => {
    requester = supertest(`${BASE_API_URL}`);
  });
  it("Should POST /api/sessions/register - successfully register a new user with code 302", async () => {
    const userBody = {
      first_name: "Usuario",
      last_name: "De prueba",
      email: "prueba@gmail.com",
      age: 34,
      password: "123456aA$",
    };
    const { statusCode, redirect } = await requester
      .post(`${SESSIONS_ROUTE}/register`)
      .send(userBody);
    expect(statusCode).to.equal(302);
    expect(redirect).to.be.ok;
  });
  it("Should POST /api/sessions/login - successfully complete a login process with code 200", async () => {
    const user = {
      email: "prueba@gmail.com",
      password: "123456aA$",
    };
    const { statusCode, ok, header } = await requester
      .post(`${SESSIONS_ROUTE}/login`)
      .send({ email: user.email, password: user.password });
    const cookieRes = header["set-cookie"][0];
    expect(statusCode).to.equal(200);
    expect(ok).to.be.ok;
    expect(cookieRes).to.be.ok;
    const cookie = {
      name: cookieRes.split("=")[0],
      value: cookieRes.split("=")[1].split(";")[0],
    };
    expect(cookie.name).to.be.ok;
    expect(cookie.name).to.be.equal("Cookie");
    expect(cookie.value).to.be.ok;
  });
  it("Should GET /api/sessions/current - successfully check current session with code 200", async () => {
    const user = {
      email: "prueba@gmail.com",
      password: "123456aA$",
    };
    const {
      statusCode: loginStatusCode,
      ok: loginOk,
      header,
    } = await requester
      .post(`${SESSIONS_ROUTE}/login`)
      .send({ email: user.email, password: user.password });
    expect(loginStatusCode).to.equal(200);
    expect(loginOk).to.be.ok;
    const cookieRes = header["set-cookie"][0];
    const mockCookie = {
      name: cookieRes.split("=")[0],
      value: cookieRes.split("=")[1].split(";")[0],
    };
    const { statusCode, ok, _body } = await requester
      .get(`${SESSIONS_ROUTE}/current`)
      .set("Cookie", [`${mockCookie.name}=${mockCookie.value}`]);
    expect(statusCode).to.equal(200);
    expect(ok).to.be.ok;
    expect(_body.authDTO.email).to.equal("prueba@gmail.com");
    expect(_body.authDTO).to.have.property("role");
  });
});