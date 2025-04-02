import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";

@Injectable()
export class loggerGlobal implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction){
        const horaYFechaActual = new Date().toISOString();
        console.log(`Estas ejecutando un método ${req.method} en la ruta ${req.url} a las ${horaYFechaActual}`)
        next()
    }
}