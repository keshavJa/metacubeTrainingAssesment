import { LightningElement, api } from 'lwc';

export default class DoPagination extends LightningElement {
    
    firstHandler(){
        this.dispatchEvent(new CustomEvent('first'));
    }

    previousHandler() {
        this.dispatchEvent(new CustomEvent('previous'));
    }

    nextHandler() {
        this.dispatchEvent(new CustomEvent('next'));
    } 
    
    lastHandler(){
        this.dispatchEvent(new CustomEvent('last'));
    }

    @api
    disableEnableAction(currPage, lastPage){
		let buttons = this.template.querySelectorAll('lightning-button');
		buttons.forEach(btn =>{
            if(btn.label === 'First' || btn.label === 'Previous'){
                if(currPage == 1){ 
                    btn.disabled = true;
                }
                else{
                    btn.disabled = false;
                }
            }

            if(btn.label === 'Last' || btn.label === 'Next'){
                if(currPage === lastPage){ 
                    btn.disabled = true;
                }
                else{
                    btn.disabled = false;
                }
            }
		});
	}

    @api
    disableEnableActionAll(){
        let buttons = this.template.querySelectorAll('lightning-button');
		buttons.forEach(btn =>{
            btn.disabled = true;
        });

    }
}