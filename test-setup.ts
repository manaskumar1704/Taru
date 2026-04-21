import "@testing-library/jest-dom"
import { JSDOM } from "jsdom"
import { Window } from "happy-dom"

const { window } = new JSDOM("<!DOCTYPE html><html><body></body></html>", { url: "http://localhost" })
globalThis.document = window.document
globalThis.window = window as any
globalThis.HTMLElement = window.HTMLElement
globalThis.Element = window.Element
globalThis.Node = window.Node
globalThis.localStorage = window.localStorage