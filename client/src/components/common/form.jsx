import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";


function CommonForm({ formControls, formData, setFormData, onSubmit, buttonText, isBtnDisabled }) {
  function renderInputsByComponentType(getControlItem) {
    let element = null
    const fieldName = getControlItem.name
    const fieldId = getControlItem.id || getControlItem.name
    const value = formData[fieldName] || ""

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={fieldName}
            placeholder={getControlItem.placeholder}
            id={fieldId}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [fieldName]: event.target.value,
              })
            }
          />
        )
        break
      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [fieldName]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        )
        break
      case "textarea":
        element = (
          <Textarea
            name={fieldName}
            placeholder={getControlItem.placeholder}
            id={fieldId}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [fieldName]: event.target.value,
              })
            }
          />
        )
        break
      default:
        element = (
          <Input
            name={fieldName}
            placeholder={getControlItem.placeholder}
            id={fieldId}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [fieldName]: event.target.value,
              })
            }
          />
        )
        break
    }

    return element
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  )
}

export default CommonForm

