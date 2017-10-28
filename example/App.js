import React, { Component } from "react";
import TextInput from "./TextInput";
import RadioButtons from "./RadioButtons";
import SubmitButton from "./SubmitButton";
import VeasyForm, { createInitialState, getFieldsValue } from "veasy";

class App extends Component {
  constructor() {
    super();
    this.formSchema = {
      title: { minLength: 3 },
      description: { minLength: 5 },
      answer: { default: "not care" }
    };
    const myState = { fieldsValues: "" };
    this.state = createInitialState(this.formSchema, myState);
  }

  updateFieldsValues = e => {
    e.preventDefault();
    this.updateState({
      fieldsValues: getFieldsValue(this.formSchema, this.state)
    });
  };

  updateState = state => {
    this.setState(state);
  };

  render() {
    return (
      <VeasyForm
        schema={this.formSchema}
        allState={this.state}
        update={this.updateState}
      >
        <TextInput
          name="title"
          placeholder="Put your title here  "
        />
        <TextInput
          name="description"
          placeholder="Put your desc here"
        />
        <RadioButtons
          label="Answer"
          name="answer"
          values={["yes", "no", "not care"]}
        />
        <SubmitButton
          shouldDisable={!this.state.isFormOK}
          onClick={this.updateFieldsValues}
        />
        <button type="reset">reset</button>
        <p>Data to send: {JSON.stringify(this.state.fieldsValues)}</p>
      </VeasyForm>
    );
  }
}

export default App;
