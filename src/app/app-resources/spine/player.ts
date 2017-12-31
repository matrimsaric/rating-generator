export class Player {
    name: string;
    id: number;
    tag: string;
    rating: number = 1500;
    deviation: number = 300;
    volatility: number = 0.6;
    oldRating: number = 1500;
    oldDeviation: number = 300;
    oldVolatility: number = 0.6;
    clanId: number = -1;
    active: boolean = true;
    lastActive: string = "";
    discord: number = 0;
}
