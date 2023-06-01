import React from "react";
import "./StepsCreation.scss";
import { InputTextarea } from "primereact/inputtextarea";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlinePlusCircle } from "react-icons/ai";

const StepsCreation = (props) => {
  return (
    <>
      <div className="steps">
        {props.stepsList.map((step, index) => (
          <div className="step" key={index}>
            <InputTextarea
              placeholder="Description de l'étape"
              className="recipe__form__field-step"
              value={step.description}
              onChange={(e) => {
                let tempArray = [...props.stepsList];
                tempArray.forEach((element) => {
                  if (element.stepIndex === step.stepIndex) {
                    element.description = e.target.value;
                  }
                });
                props.setStepsList(tempArray);
              }}
            />
            {step.stepIndex !== 1 && !props.nobutton && (
              <RiDeleteBin6Line
                className="bin"
                onClick={(e) => {
                  e.preventDefault();
                  let tempArray = [...props.stepsList];
                  tempArray = tempArray.filter(
                    (element) => element.stepIndex !== step.stepIndex
                  );
                  props.setStepsList(tempArray);
                }}
              ></RiDeleteBin6Line>
            )}
          </div>
        ))}
        {props.errorStepMessage && (
          <small className="p-error">{props.errorStepMessage}</small>
        )}
      </div>
      {!props.nobutton && (
        <button
          className="btn-blanc"
          onClick={(e) => {
            e.preventDefault();
            props.setStepsList([
              ...props.stepsList,
              {
                description: "",
                stepIndex:
                  props.stepsList[props.stepsList.length - 1].stepIndex + 1,
              },
            ]);
          }}
        >
          <AiOutlinePlusCircle />
          Ajouter une étape
        </button>
      )}
    </>
  );
};

export default StepsCreation;
