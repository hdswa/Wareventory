import { NgModule } from "@angular/core";
import { WareVentoryUseCase } from "./application/wareventory.usecase";
import { WareventoryRepository } from "./domain/wareventory.repository";
import { WareventoryImplRepository } from "./infrastructure/wareventory-impl.respository";

const wareventoryQueryUseCaseFactory =
(wareventoryRepo:WareventoryRepository)=>new WareVentoryUseCase(wareventoryRepo);
export const wareventoryQueryUseCaseProvider = {
    provide: WareVentoryUseCase,
    useFactory: wareventoryQueryUseCaseFactory,
    deps: [WareventoryRepository]
};


@NgModule({
    providers: [
        wareventoryQueryUseCaseProvider,
        { provide: WareventoryRepository, useClass: WareventoryImplRepository}
    ]
})

export class DataModule { }