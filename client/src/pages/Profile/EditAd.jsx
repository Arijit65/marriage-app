import React from "react";
import { UploadCloud, Save, Info } from "lucide-react";

// Reusable field wrappers
const Label = ({ children }) => (
  <label className="block text-sm font-medium text-slate-700 mb-1">
    {children}
  </label>
);

const Input = (props) => (
  <input
    {...props}
    className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm
    focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400
    bg-white`}
  />
);

const Select = ({ children, ...rest }) => (
  <select
    {...rest}
    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white
    focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
  >
    {children}
  </select>
);

const Textarea = (props) => (
  <textarea
    {...props}
    className="w-full min-h-[96px] rounded-lg border border-slate-300 px-3 py-2 text-sm
    focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 bg-white"
  />
);

export default function EditAd() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 lg:px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">Edit My Ad</h1>
          <button className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-6 grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Left column: quick card & meta */}
        <aside className="space-y-6">
          {/* Current poster */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-800">My Gallery</h2>
              <span className="text-[11px] px-2 py-1 rounded-full bg-slate-100 text-slate-600">1/5</span>
            </div>
            <div className="rounded-md overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src="https://dummyimage.com/600x400/eeeeee/333&text=Your+Poster"
                alt="poster"
                className="w-full h-40 object-cover"
              />
            </div>
            <button className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-300 text-emerald-700 px-3 py-2 text-sm hover:bg-emerald-50">
              <UploadCloud className="h-4 w-4" />
              Upload New
            </button>
          </div>

          {/* Important notes */}
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 text-sm text-amber-900">
            <div className="flex items-center gap-2 font-semibold">
              <Info className="h-4 w-4" />
              Editing Notes
            </div>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Fields marked with “*” are mandatory.</li>
              <li>Use accurate spellings and avoid abbreviations.</li>
              <li>Changes may require verification in some cases.</li>
            </ul>
          </div>
        </aside>

        {/* Right column: two-column form */}
        <form className="bg-white rounded-xl border border-slate-200 p-5 lg:p-6">
          {/* Section: My Details */}
          <h3 className="text-base font-semibold text-slate-900 mb-4">My Details</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Profile For *</Label>
              <Select defaultValue="Self">
                <option>Self</option>
                <option>Son</option>
                <option>Daughter</option>
                <option>Relative</option>
              </Select>
            </div>
            <div>
              <Label>Gender *</Label>
              <Select defaultValue="Groom">
                <option>Groom</option>
                <option>Bride</option>
              </Select>
            </div>
            <div>
              <Label>Full Name *</Label>
              <Input placeholder="Enter full name" />
            </div>
            <div>
              <Label>Date of Birth *</Label>
              <Input type="date" />
            </div>
            <div>
              <Label>Religion *</Label>
              <Select defaultValue="Hindu">
                <option>Hindu</option>
                <option>Muslim</option>
                <option>Christian</option>
                <option>Sikh</option>
                <option>Other</option>
              </Select>
            </div>
            <div>
              <Label>Mother Tongue *</Label>
              <Select defaultValue="Bengali">
                <option>Bengali</option>
                <option>Hindi</option>
                <option>Assamese</option>
                <option>Telugu</option>
                <option>Other</option>
              </Select>
            </div>
            <div>
              <Label>Marital Status *</Label>
              <Select defaultValue="Unmarried">
                <option>Unmarried</option>
                <option>Divorced</option>
                <option>Widowed</option>
              </Select>
            </div>
            <div>
              <Label>Height *</Label>
              <Select defaultValue="5'9">
                <option>5'0"</option><option>5'2"</option><option>5'4"</option>
                <option>5'6"</option><option>5'8"</option><option>5'9"</option>
                <option>6'0"</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>About Myself</Label>
              <Textarea placeholder="Write a short self-description..." />
            </div>
          </div>

          {/* Section: Education & Profession */}
          <h3 className="mt-8 text-base font-semibold text-slate-900 mb-4">Education & Profession</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Highest Qualification *</Label>
              <Select defaultValue="Graduate">
                <option>Under Graduate</option>
                <option>Graduate</option>
                <option>Post Graduate</option>
                <option>Doctorate</option>
              </Select>
            </div>
            <div>
              <Label>Qualification Details</Label>
              <Input placeholder="e.g. B.Tech (CSE), Honors" />
            </div>
            <div>
              <Label>Profession *</Label>
              <Select defaultValue="Engineer">
                <option>Engineer</option>
                <option>Doctor</option>
                <option>Teacher</option>
                <option>Business</option>
                <option>Other</option>
              </Select>
            </div>
            <div>
              <Label>Company/Organization</Label>
              <Input placeholder="Name of current company/organization" />
            </div>
            <div>
              <Label>Annual Income</Label>
              <Select defaultValue="5-10 LPA">
                <option>0-5 LPA</option>
                <option>5-10 LPA</option>
                <option>10-20 LPA</option>
                <option>20+ LPA</option>
              </Select>
            </div>
            <div>
              <Label>Work Location</Label>
              <Input placeholder="City, State" />
            </div>
          </div>

          {/* Section: Family & Residence */}
          <h3 className="mt-8 text-base font-semibold text-slate-900 mb-4">Family & Residence</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Family Details</Label>
              <Textarea placeholder="Describe family type, values, members, etc." />
            </div>
            <div>
              <Label>Resident Of</Label>
              <Input placeholder="City / State / Country" />
            </div>
            <div>
              <Label>Native Place</Label>
              <Input placeholder="City / State / Country" />
            </div>
          </div>

          {/* Section: Partner Preference */}
          <h3 className="mt-8 text-base font-semibold text-slate-900 mb-4">Partner Preference</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Preferred Age Range</Label>
              <Select defaultValue="25-32">
                <option>21-28</option>
                <option>25-32</option>
                <option>28-35</option>
                <option>32-40</option>
              </Select>
            </div>
            <div>
              <Label>Religion</Label>
              <Select defaultValue="Hindu">
                <option>Any</option>
                <option>Hindu</option>
                <option>Muslim</option>
                <option>Christian</option>
                <option>Sikh</option>
              </Select>
            </div>
            <div>
              <Label>Mother Tongue</Label>
              <Select defaultValue="Bengali">
                <option>Any</option>
                <option>Bengali</option>
                <option>Hindi</option>
                <option>Assamese</option>
                <option>Other</option>
              </Select>
            </div>
            <div>
              <Label>Profession</Label>
              <Select defaultValue="Any">
                <option>Any</option>
                <option>Engineer</option>
                <option>Doctor</option>
                <option>Teacher</option>
                <option>Business</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Additional Expectations</Label>
              <Textarea placeholder="Lifestyle, location, values, etc." />
            </div>
          </div>

          {/* Footer actions */}
          <div className="mt-8 flex items-center gap-3">
            <button className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700">
              <Save className="h-4 w-4" />
              Save Changes
            </button>
            <button type="button" className="inline-flex items-center gap-2 border border-slate-300 text-slate-700 px-5 py-2.5 rounded-lg hover:bg-slate-50">
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
