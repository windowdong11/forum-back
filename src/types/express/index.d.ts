import express from "express";

declare global {
  namespace Express {
    interface Request {
        author?: string
        password?: string
        title?: string
        text_content?: string
    }
  }
}