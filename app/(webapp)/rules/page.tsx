'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import RuleToggle from '@/components/RuleToggle';
import { RuleProfile } from '@/core/rules/types';
import { getDefaultRuleProfiles } from '@/core/rules/presets';

const RulesPage = () => {
  const [rules, setRules] = useState<RuleProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Загрузить правила с API
    const defaultRules = getDefaultRuleProfiles().map(rule => ({
      ...rule,
      id: `rule-${rule.key}`
    }));
    setRules(defaultRules);
    setLoading(false);
  }, []);

  const handleToggleRule = (ruleId: string, enabled: boolean) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled } : rule
    ));
    
    // TODO: Сохранить в API
  };

  const handleUpdateRule = (ruleId: string, updates: Partial<RuleProfile>) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, ...updates } : rule
    ));
    
    // TODO: Сохранить в API
  };

  if (loading) {
    return (
      <div className="tg-webapp">
        <div className="text-center mt-4">
          <p>Загрузка...</p>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="tg-webapp">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-4">Правила резиденции</h1>
        <p className="text-gray-600">Управляйте активными правилами для расчёта дней</p>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => (
          <RuleToggle
            key={rule.id}
            rule={rule}
            onToggle={(enabled) => handleToggleRule(rule.id, enabled)}
            onUpdate={(updates) => handleUpdateRule(rule.id, updates)}
          />
        ))}
      </div>

      <div className="card mt-6">
        <div className="card-title">Информация</div>
        <div className="text-sm text-gray-600 space-y-2">
          <p>• Включённые правила используются для расчёта доступных дней</p>
          <p>• Правила применяются в режиме &quot;fail-fast&quot; (строгое ограничение)</p>
          <p>• Все лимиты настраиваются в конфигурации</p>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default RulesPage;
