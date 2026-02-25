import { IdxReferences } from "@src/components/references"

const PageReferences = () => {
    return (
        <div className="">
            <IdxReferences.Text.Title />
            <IdxReferences.Text.Description />
            <IdxReferences.Disclaimer.Title />
            <IdxReferences.Disclaimer.Description />
            <IdxReferences.Disclaimer.DisclaimerDefault />
            <IdxReferences.Calculators.Text.Dehydration />
            <IdxReferences.Calculators.Text.CarbLoading />
            <IdxReferences.Calculators.Text.Dehydration />
            <IdxReferences.Calculators.Text.Osmolarity />
        </div>
    )
}

export default PageReferences;