import { Router, type Request, type Response } from "express";
import { stockController } from "../controller/stockController.js";

const router = Router();

router.get("/root", async (req: Request, res: Response) => {
  res.status(200).json({
    msg: "root route hit",
  });
});

router.get("/indexes", stockController.getIndexesInfo);
router.get("/gainers", stockController.getGainersInfo);
router.get("/losers", stockController.getLosersInfo);
router.get("/active", stockController.getMostActiveInfo);
router.get("/spotlight", stockController.getSpotlightInfo);
router.get("/news", stockController.getNews);

export default router;
