import type {
  WhatsAppMessageTemplate,
  WhatsAppTemplateComponent,
} from "@/types/whatsapp.types";

type RuntimeButtonSubType = "url" | "quick_reply";

export interface RuntimeTemplateButtonValue {
  index: number;
  subType: RuntimeButtonSubType;
  text: string;
  url?: string;
  value: string;
  hasDynamicUrl: boolean;
}

export function getTemplateComponent(
  template: WhatsAppMessageTemplate | null | undefined,
  type: WhatsAppTemplateComponent["type"],
) {
  return template?.components?.find(
    (component) => component.type.toUpperCase() === type,
  );
}

export function extractTemplatePlaceholders(text?: string): string[] {
  if (!text) {
    return [];
  }

  return [...text.matchAll(/\{\{\s*(.+?)\s*\}\}/g)].map((match) =>
    match[1].trim(),
  );
}

export function buildRuntimeButtonValues(
  template: WhatsAppMessageTemplate | null | undefined,
): RuntimeTemplateButtonValue[] {
  const buttonsComponent = getTemplateComponent(template, "BUTTONS");

  return (buttonsComponent?.buttons ?? []).reduce<RuntimeTemplateButtonValue[]>(
    (acc, button, index) => {
      const buttonType = String(button.type).toLowerCase();
      if (!buttonType.includes("url") && !buttonType.includes("quick")) {
        return acc;
      }

      const subType: RuntimeButtonSubType = buttonType.includes("quick")
        ? "quick_reply"
        : "url";
      const url = button.url?.trim();

      acc.push({
        index,
        subType,
        text: button.text || `Button ${index + 1}`,
        url: url || undefined,
        value: "",
        hasDynamicUrl: Boolean(url?.match(/\{\{\s*.+?\s*\}\}/)),
      });

      return acc;
    },
    [],
  );
}

export function buildTemplateButtonParameters(
  buttons: RuntimeTemplateButtonValue[],
) {
  return buttons
    .map((button) => ({
      index: button.index,
      subType: button.subType,
      parameters: [button.value.trim()].filter(Boolean),
    }))
    .filter((button, index) => {
      const source = buttons[index];
      return (
        button.parameters.length > 0 &&
        (source.subType !== "url" || source.hasDynamicUrl)
      );
    });
}

export function buildTemplateContentVariables(
  placeholders: string[],
  values: string[],
): Record<string, string> | undefined {
  const variables = placeholders.reduce<Record<string, string>>(
    (acc, placeholder, index) => {
      const key = placeholder.trim();
      const value = values[index]?.trim();
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    },
    {},
  );

  return Object.keys(variables).length > 0 ? variables : undefined;
}

export function renderTemplateTextWithValues(
  text: string,
  values: string[],
): string {
  let occurrenceIndex = 0;

  return text.replace(/\{\{\s*(.+?)\s*\}\}/g, (match, key: string) => {
    const normalizedKey = key.trim();
    const index = Number(normalizedKey);
    const valueIndex = occurrenceIndex;
    occurrenceIndex += 1;

    if (!Number.isNaN(index) && index > 0) {
      return values[index - 1]?.trim() || match;
    }

    const value = values[valueIndex]?.trim();

    return value || match;
  });
}
