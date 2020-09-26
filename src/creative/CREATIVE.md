#Creative Portion Not in SRC
For my creative portion, I added a button in AShape2DEditorToolPanel.js which isn't in the src folder, so I was not able 
to include it in my src submission. Most of my code for the creative portion is in A1Component.jsx. In 
AShape2DEditorToolPanel.js, I added a method:



`onSurpriseShapeButtonClick(){
    this.getAppState('onSurpriseShapeButtonClick')();}`
    
Then, in bindMethods(), I added:

`this.onSurpriseShapeButtonClick = this.onSurpriseShapeButtonClick.bind(this);`
                                                  
Finally, I added:

`<div className={"p-2 align-items-center align-self-center"}>
                             <button onClick = {this.onSurpriseShapeButtonClick}>
                                 Surprise
                             </button>
                         </div>` 
                         
                                                                                       