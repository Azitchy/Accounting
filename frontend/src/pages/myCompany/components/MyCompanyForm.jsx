function MyCompanyForm() {
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-5">
        <h2 className="text-[1.05rem] font-medium text-slate-800">Business Details</h2>

        <Field label="Business Name*" value="My Company" />
        <Field label="Phone Number" value="9804782268" />
        <Field label="Email ID" placeholder="Enter Email ID" />

        <div className="pt-14">
          <Field label="Account Books Beginning Date" value="05/07/2026" trailing="📅" />
        </div>
      </div>

      <div className="space-y-5">
        <h2 className="text-[1.05rem] font-medium text-slate-800">More Details</h2>

        <Field label="Business Type" placeholder="Select Business Type" dropdown />
        <Field label="Business Category" placeholder="Select Business Category" dropdown />
        <Field label="Pincode" placeholder="Enter Pincode" />
      </div>

      <div className="space-y-5">
        <h2 className="text-[1.05rem] font-medium text-slate-800">&nbsp;</h2>

        <Field label="Business Address" placeholder="Enter Business Address" textarea />
        <SignatureUpload />
      </div>
    </div>
  )
}

function Field({ label, value, placeholder, textarea = false, dropdown = false, trailing }) {
  const common =
    'w-full rounded-[8px] border border-[#c1cbea] px-3 py-2.5 text-[0.92rem] text-slate-700 outline-none transition focus:border-[#1b73e8] focus:shadow-[0_0_0_2px_rgba(27,115,232,0.15)]'

  return (
    <label className="block">
      <span className="mb-2 block text-[0.88rem] text-[#5d6da4]">{label}</span>
      {textarea ? (
        <textarea className={`${common} min-h-[103px] resize-none`} placeholder={placeholder} defaultValue={value} />
      ) : (
        <div className="relative">
          <input
            className={`${common} ${dropdown ? 'pr-10' : ''} ${trailing ? 'pr-10' : ''}`}
            placeholder={placeholder}
            defaultValue={value}
          />
          {dropdown ? (
            <span className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-slate-400">
              v
            </span>
          ) : null}
          {trailing ? (
            <span className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-[0.95rem]">
              {trailing}
            </span>
          ) : null}
        </div>
      )}
    </label>
  )
}

function SignatureUpload() {
  return (
    <div>
      <span className="mb-2 block text-[0.88rem] text-[#5d6da4]">Add Signature</span>
      <button
        type="button"
        className="flex min-h-[103px] w-full flex-col items-center justify-center rounded-[8px] border border-dashed border-[#c1cbea] bg-[#fafbff] text-[#9aa1c4]"
      >
        <span className="text-[1.8rem]">☁</span>
        <span className="mt-2">Upload Signature</span>
      </button>
    </div>
  )
}

export default MyCompanyForm
