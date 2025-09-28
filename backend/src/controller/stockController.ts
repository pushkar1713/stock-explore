import { type Request, type Response } from "express";
import { stockService } from "../services/stockService.js";
import { apiResponse } from "../utils/globalResponseHandler.js";
import {
  BaseError,
  ErrorFactory,
  globalErrorHandler,
} from "../utils/globalErrorHandler.js";

export const stockController = {
  getIndexesInfo: async (req: Request, res: Response): Promise<void> => {
    try {
      const stockInfo = await stockService.getIndexesInfo();

      apiResponse(res, {
        statusCode: 200,
        message: "Stock info retrieved",
        data: stockInfo,
      });
    } catch (error) {
      console.error("Error in getStockInfo:", error);
      globalErrorHandler(error as BaseError, req, res);
    }
  },
  getGainersInfo: async (req: Request, res: Response): Promise<void> => {
    try {
      const gainersInfo = await stockService.getGainersInfo();

      apiResponse(res, {
        statusCode: 200,
        message: "Gainers info retrieved",
        data: gainersInfo,
      });
    } catch (error) {
      console.error("Error in getGainersInfo:", error);
      globalErrorHandler(error as BaseError, req, res);
    }
  },
  getLosersInfo: async (req: Request, res: Response): Promise<void> => {
    try {
      const losersInfo = await stockService.getLosersInfo();

      apiResponse(res, {
        statusCode: 200,
        message: "Losers info retrieved",
        data: losersInfo,
      });
    } catch (error) {
      console.error("Error in getLosersInfo:", error);
      globalErrorHandler(error as BaseError, req, res);
    }
  },
  getMostActiveInfo: async (req: Request, res: Response): Promise<void> => {
    try {
      const mostActiveInfo = await stockService.getMostActiveInfo();

      apiResponse(res, {
        statusCode: 200,
        message: "Most Active info retrieved",
        data: mostActiveInfo,
      });
    } catch (error) {
      console.error("Error in getMostActiveInfo:", error);
      globalErrorHandler(error as BaseError, req, res);
    }
  },
  getSpotlightInfo: async (req: Request, res: Response): Promise<void> => {
    try {
      const spotlightInfo = await stockService.getSpotlight();

      apiResponse(res, {
        statusCode: 200,
        message: "Spotlight info retrieved",
        data: spotlightInfo,
      });
    } catch (error) {
      console.error("Error in getSpotlightInfo:", error);
      globalErrorHandler(error as BaseError, req, res);
    }
  },
  getNews: async (req: Request, res: Response): Promise<void> => {
    try {
      const news = await stockService.getNews();

      apiResponse(res, {
        statusCode: 200,
        message: "News info retrieved",
        data: news,
      });
    } catch (error) {
      console.error("Error in getNews:", error);
      globalErrorHandler(error as BaseError, req, res);
    }
  },
};
