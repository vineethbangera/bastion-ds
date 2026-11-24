import { dark, light } from "@bastion/tokens"

type TokenName = keyof typeof light

const toCamel = (name: string) =>
  name.replace(/-(.)/g, (_, c: string) => c.toUpperCase()) as TokenName

// One row per token: its CSS variable, and the Light and Dark values read
// from @bastion/tokens, so this page can't drift from the build.
export function TokenSwatches({ names }: { names: string[] }) {
  return (
    <table className="my-4 w-full border-collapse text-sm">
      <thead>
        <tr className="text-left">
          <th className="py-2">Token</th>
          <th className="py-2">Light</th>
          <th className="py-2">Dark</th>
        </tr>
      </thead>
      <tbody>
        {names.map((name) => (
          <tr key={name} className="border-t">
            <td className="py-2 font-mono">--{name}</td>
            {[light, dark].map((mode, i) => (
              <td key={i} className="py-2">
                <span className="flex items-center gap-2 font-mono">
                  <span
                    className="inline-block size-6 rounded-md border"
                    style={{ background: mode[toCamel(name)] }}
                  />
                  {mode[toCamel(name)]}
                </span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
